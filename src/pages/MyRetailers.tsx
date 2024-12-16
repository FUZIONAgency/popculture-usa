import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { RetailerConnectionsCard } from "@/components/account/RetailerConnectionsCard";
import type { Player } from "@/types/player";
import { supabase } from "@/integrations/supabase/client";

const MyRetailers = () => {
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const checkAndLoadPlayer = async () => {
      // First check localStorage
      const storedPlayer = localStorage.getItem('currentPlayer');
      console.log('Stored player data:', storedPlayer);
      
      if (storedPlayer) {
        try {
          const playerData = JSON.parse(storedPlayer);
          console.log('Parsed player data:', playerData);
          setCurrentPlayer(playerData);
          return;
        } catch (error) {
          console.error('Error parsing player data:', error);
        }
      }

      // If no stored player, try to fetch from Supabase
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const { data: player, error } = await supabase
            .from('players')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (error) {
            console.error('Error fetching player:', error);
            return;
          }

          if (player) {
            console.log('Found player in database:', player);
            localStorage.setItem('currentPlayer', JSON.stringify(player));
            setCurrentPlayer(player);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkAndLoadPlayer();
  }, []);

  if (!currentPlayer) {
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
      <RetailerConnectionsCard player={currentPlayer} />
    </div>
  );
};

export default MyRetailers;