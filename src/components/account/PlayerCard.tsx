import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Player } from "@/types/player";

interface PlayerCardProps {
  player: Player | null;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Information</CardTitle>
      </CardHeader>
      <CardContent>
        {player ? (
          <div className="space-y-4">
            <div>
              <label className="font-medium">Alias</label>
              <p className="text-gray-600">{player.alias}</p>
            </div>
            {player.city && (
              <div>
                <label className="font-medium">City</label>
                <p className="text-gray-600">{player.city}</p>
              </div>
            )}
            {player.state && (
              <div>
                <label className="font-medium">State</label>
                <p className="text-gray-600">{player.state}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">No player account found</p>
            <Button 
              variant="destructive"
              onClick={() => navigate('/create-player')}
            >
              Create a Player Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};