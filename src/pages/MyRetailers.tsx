import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { RetailerConnectionsCard } from "@/components/account/RetailerConnectionsCard";
import type { Player } from "@/types/player";

const MyRetailers = () => {
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    // Get player data from localStorage
    const storedPlayer = localStorage.getItem('currentPlayer');
    if (storedPlayer) {
      try {
        const playerData = JSON.parse(storedPlayer);
        setCurrentPlayer(playerData);
      } catch (error) {
        console.error('Error parsing player data:', error);
      }
    }
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