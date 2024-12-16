import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Player } from "@/types/player";
import type { Retailer } from "@/types/retailer";

export const useRetailerConnections = (player: Player | null) => {
  const queryClient = useQueryClient();

  // Verify player ownership by matching emails
  const verifyPlayerOwnership = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email || !player?.email) {
      throw new Error('Authentication required');
    }

    // Verify that the player email matches the authenticated user's email
    if (player.email !== session.user.email) {
      throw new Error('Unauthorized access');
    }

    return true;
  };

  // Fetch connected retailers with proper join
  const { data: connectedRetailers, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['connectedRetailers', player?.id],
    queryFn: async () => {
      if (!player?.id) return [];
      
      await verifyPlayerOwnership();

      console.log('Fetching connected retailers for player:', player.id);

      // Updated query to properly join tables and select retailer data
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .in('id', (
          supabase
            .from('player_retailers')
            .select('retailer_id')
            .eq('player_id', player.id)
            .eq('status', 'active')
        ));

      if (error) {
        console.error('Error fetching connected retailers:', error);
        throw error;
      }

      console.log('Connected retailers:', data);
      return data as Retailer[];
    },
    enabled: !!player?.id,
  });

  // Fetch available retailers
  const { data: availableRetailers, isLoading: isLoadingRetailers } = useQuery({
    queryKey: ['availableRetailers', player?.id],
    queryFn: async () => {
      if (!player?.id) return [];

      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error fetching available retailers:', error);
        throw error;
      }
      
      // Filter out already connected retailers
      const connectedIds = new Set((connectedRetailers || []).map(r => r.id));
      return data.filter(retailer => !connectedIds.has(retailer.id));
    },
    enabled: !!player?.id && !isLoadingConnections,
  });

  // Connect retailer mutation
  const connectRetailer = useMutation({
    mutationFn: async (retailerId: string) => {
      if (!player?.id) throw new Error('No player ID');

      await verifyPlayerOwnership();

      const { error } = await supabase
        .from('player_retailers')
        .insert({
          player_id: player.id,
          retailer_id: retailerId,
          status: 'active'
        });

      if (error) {
        console.error('Connection error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectedRetailers'] });
      queryClient.invalidateQueries({ queryKey: ['availableRetailers'] });
      toast.success('Successfully connected to retailer');
    },
    onError: (error) => {
      console.error('Connection error:', error);
      toast.error('Failed to connect to retailer');
    }
  });

  // Disconnect retailer mutation
  const disconnectRetailer = useMutation({
    mutationFn: async (retailerId: string) => {
      if (!player?.id) throw new Error('No player ID');

      await verifyPlayerOwnership();

      const { error } = await supabase
        .from('player_retailers')
        .delete()
        .eq('player_id', player.id)
        .eq('retailer_id', retailerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectedRetailers'] });
      queryClient.invalidateQueries({ queryKey: ['availableRetailers'] });
      toast.success('Successfully disconnected from retailer');
    },
    onError: (error) => {
      console.error('Disconnection error:', error);
      toast.error('Failed to disconnect from retailer');
    }
  });

  return {
    connectedRetailers,
    availableRetailers,
    isLoadingConnections,
    isLoadingRetailers,
    connectRetailer,
    disconnectRetailer,
  };
};