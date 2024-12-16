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

    if (player.email !== session.user.email) {
      throw new Error('Unauthorized access');
    }

    return true;
  };

  // Fetch player-retailer connections
  const { data: playerRetailerConnections } = useQuery({
    queryKey: ['playerRetailerConnections', player?.id],
    queryFn: async () => {
      if (!player?.id) return [];
      
      const { data, error } = await supabase
        .from('player_retailers')
        .select('id, retailer_id, player_id')
        .eq('player_id', player.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching player_retailers:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!player?.id,
  });

  // Fetch connected retailers with proper join
  const { data: connectedRetailers, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['connectedRetailers', player?.id],
    queryFn: async () => {
      if (!player?.id) return [];
      
      console.log('Fetching connected retailers for player:', player.id);

      const connections = playerRetailerConnections;
      
      if (!connections || connections.length === 0) {
        console.log('No connections found for player');
        return [];
      }

      const retailerIds = connections.map(conn => conn.retailer_id);
      console.log('Connected retailer IDs:', retailerIds);

      const { data: retailers, error: retailersError } = await supabase
        .from('retailers')
        .select('*')
        .in('id', retailerIds);

      if (retailersError) {
        console.error('Error fetching retailers:', retailersError);
        throw retailersError;
      }

      console.log('Connected retailers:', retailers);
      return retailers || [];
    },
    enabled: !!player?.id && !!playerRetailerConnections,
  });

  // Fetch available retailers (excluding already connected ones)
  const { data: availableRetailers, isLoading: isLoadingRetailers } = useQuery({
    queryKey: ['availableRetailers', player?.id, connectedRetailers],
    queryFn: async () => {
      if (!player?.id) return [];

      const connectedIds = (connectedRetailers || []).map(r => r.id);
      console.log('Connected retailer IDs:', connectedIds);

      const { data: retailers, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('status', 'active')
        .not('id', 'in', `(${connectedIds.join(',')})`)
        .order('name');

      if (error) {
        console.error('Error fetching available retailers:', error);
        throw error;
      }

      console.log('Available retailers:', retailers);
      return retailers || [];
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
      queryClient.invalidateQueries({ queryKey: ['playerRetailerConnections'] });
      toast.success('Successfully connected to retailer');
    },
    onError: (error) => {
      console.error('Connection error:', error);
      toast.error('Failed to connect to retailer');
    }
  });

  // Disconnect retailer mutation
  const disconnectRetailer = useMutation({
    mutationFn: async ({ playerRetailerId }: { playerRetailerId: string }) => {

      const { error } = await supabase
        .from('player_retailers')
        .delete()
        .eq('id', playerRetailerId);

      if (error) {
        console.error('Disconnection error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectedRetailers'] });
      queryClient.invalidateQueries({ queryKey: ['availableRetailers'] });
      queryClient.invalidateQueries({ queryKey: ['playerRetailerConnections'] });
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
    playerRetailerConnections
  };
};