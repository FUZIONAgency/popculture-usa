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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Player Information</CardTitle>
        {!player && (
          <Button 
            variant="destructive"
            onClick={() => navigate('/create-player')}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Create Player Account
          </Button>
        )}
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
            <p className="text-gray-600">No player account found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};