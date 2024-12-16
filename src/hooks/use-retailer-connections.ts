import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Player } from "@/types/player";
import type { Retailer } from "@/types/retailer";

export const useRetailerConnections = (player: Player | null) => {
  const queryClient = useQueryClient();

  // Verify player ownership
  const verifyPlayerOwnership = async (playerId: string) => {
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .select('id, auth_id')
      .eq('id', playerId)
      .single();

    if (playerError || !playerData) {
      throw new Error('Unauthorized access');
    }
    return playerData;
  };

  // Fetch connected retailers
  const { data: connectedRetailers, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['connectedRetailers', player?.id],
    queryFn: async () => {
      if (!player?.id) return [];
      
      await verifyPlayerOwnership(player.id);

      const { data, error } = await supabase
        .from('player_retailers')
        .select(`
          retailer_id,
          retailers (
            id,
            name,
            city,
            state
          )
        `)
        .eq('player_id', player.id)
        .eq('status', 'active');

      if (error) throw error;
      return data.map(pr => pr.retailers) as Retailer[];
    },
    enabled: !!player?.id,
  });

  // Fetch available retailers
  const { data: availableRetailers, isLoading: isLoadingRetailers } = useQuery({
    queryKey: ['availableRetailers', player?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Filter out already connected retailers
      const connectedIds = new Set(connectedRetailers?.map(r => r.id));
      return data.filter(retailer => !connectedIds.has(retailer.id));
    },
    enabled: !!player?.id && !!connectedRetailers,
  });

  // Connect retailer mutation
  const connectRetailer = useMutation({
    mutationFn: async (retailerId: string) => {
      if (!player?.id) throw new Error('No player ID');

      await verifyPlayerOwnership(player.id);

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

      await verifyPlayerOwnership(player.id);

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