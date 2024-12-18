import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Player } from "@/types/player";
import type { PlayerGameAccount, GameSystem } from "@/types/game";

interface GameAccountsCardProps {
  player: Player | null;
  gameAccounts: (PlayerGameAccount & { game_system: GameSystem })[];
}

export const GameAccountsCard = ({ player, gameAccounts }: GameAccountsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Game Systems</CardTitle>
        {player && (
          <Button 
            variant="secondary"
            onClick={() => navigate('/add-game-account')}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Add Game
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {player ? (
          <div className="space-y-4">
            {gameAccounts.length > 0 ? (
              gameAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">
                      Game System: {account.game_system?.name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-600">Game System ID: {account.game_system_id}</p>
                    <p className="text-sm text-gray-600">Account ID: {account.account_id}</p>
                    <p className="text-sm text-gray-600">Status: {account.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 mb-4">No game accounts linked</p>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};