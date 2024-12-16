import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { RetailerConnectionsCard } from "@/components/account/RetailerConnectionsCard";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MyRetailers = () => {
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState<string | null>(null);

  // Fetch the current player's ID
  const { data: player, isLoading: isLoadingPlayer } = useQuery({
    queryKey: ['currentPlayer'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data: player, error } = await supabase
        .from('players')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();

      if (error) throw error;
      return player;
    },
  });

  useEffect(() => {
    if (player?.id) {
      setPlayerId(player.id);
      localStorage.setItem('playerId', player.id);
    }
  }, [player?.id]);

  if (isLoadingPlayer) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No Player Profile</h3>
          <p className="mt-1 text-sm text-gray-500">
            You need to create a player profile first.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/create-player')}>
              Create Player Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Retailers</h1>
      <RetailerConnectionsCard player={player} />
    </div>
  );
};

export default MyRetailers;