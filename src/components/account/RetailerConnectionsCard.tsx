import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Link as LinkIcon, Plus, X } from "lucide-react";
import type { Player } from "@/types/player";
import type { Retailer } from "@/types/retailer";

interface RetailerConnectionsCardProps {
  player: Player | null;
}

export const RetailerConnectionsCard = ({ player }: RetailerConnectionsCardProps) => {
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  // Fetch connected retailers
  const { data: connectedRetailers, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['connectedRetailers', player?.id],
    queryFn: async () => {
      if (!player?.id) return [];
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
    enabled: !!player?.id,
  });

  // Connect retailer mutation
  const connectRetailer = useMutation({
    mutationFn: async (retailerId: string) => {
      if (!player?.id) throw new Error('No player ID');
      const { error } = await supabase
        .from('player_retailers')
        .insert({
          player_id: player.id,
          retailer_id: retailerId,
          status: 'active'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectedRetailers'] });
      queryClient.invalidateQueries({ queryKey: ['availableRetailers'] });
      toast.success('Successfully connected to retailer');
      setIsConnecting(false);
    },
    onError: () => {
      toast.error('Failed to connect to retailer');
    }
  });

  // Disconnect retailer mutation
  const disconnectRetailer = useMutation({
    mutationFn: async (retailerId: string) => {
      if (!player?.id) throw new Error('No player ID');
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
    onError: () => {
      toast.error('Failed to disconnect from retailer');
    }
  });

  if (!player) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Retailer Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingConnections ? (
          <p>Loading connections...</p>
        ) : connectedRetailers?.length === 0 ? (
          <p className="text-gray-500">No connected retailers</p>
        ) : (
          <div className="space-y-4">
            {connectedRetailers?.map((retailer) => (
              <div key={retailer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Link to={`/retailers/${retailer.id}`} className="font-medium hover:text-red-600">
                    {retailer.name}
                  </Link>
                  <p className="text-sm text-gray-500">{retailer.city}, {retailer.state}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => disconnectRetailer.mutate(retailer.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {!isConnecting ? (
          <Button
            variant="outline"
            onClick={() => setIsConnecting(true)}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Connect to Retailer
          </Button>
        ) : (
          <div className="mt-4 space-y-4">
            <h4 className="font-medium">Select a retailer to connect with:</h4>
            {isLoadingRetailers ? (
              <p>Loading retailers...</p>
            ) : (
              <div className="space-y-2">
                {availableRetailers?.map((retailer) => (
                  <div key={retailer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{retailer.name}</p>
                      <p className="text-sm text-gray-500">{retailer.city}, {retailer.state}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => connectRetailer.mutate(retailer.id)}
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="ghost"
              onClick={() => setIsConnecting(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};