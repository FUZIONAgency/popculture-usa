import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import type { Player } from '@/types/player';
import type { GameSystem, PlayerGameAccount } from '@/types/game';

const MyAccount = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameAccounts, setGameAccounts] = useState<(PlayerGameAccount & { game_system: GameSystem })[]>([]);

  useEffect(() => {
    const getProfileAndPlayer = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile({
          email: session.user.email,
          ...profileData
        });

        // Check for player record
        if (session.user.email) {
          const { data: playerData } = await supabase
            .from('players')
            .select('*')
            .eq('email', session.user.email)
            .single();
          
          setPlayer(playerData);

          // If we have a player, fetch their game accounts
          if (playerData) {
            const { data: gameAccountsData } = await supabase
              .from('player_game_accounts')
              .select(`
                *,
                game_system:game_systems(*)
              `)
              .eq('player_id', playerData.id);
            
            setGameAccounts(gameAccountsData || []);
          }
        }
      }
      setLoading(false);
    };

    getProfileAndPlayer();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="font-medium">Email</label>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
              <div>
                <label className="font-medium">Username</label>
                <p className="text-gray-600">{profile?.username || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Information */}
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

        {/* Game Systems */}
        {player && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Game Systems</CardTitle>
              <Button
                className="h-24 w-24 p-0"
                onClick={() => navigate('/add-game-account')}
              >
                <Plus className="h-12 w-12" />
              </Button>
            </CardHeader>
            <CardContent>
              {gameAccounts.length > 0 ? (
                <div className="grid gap-4">
                  {gameAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{account.game_system.name}</h3>
                        <p className="text-sm text-gray-600">
                          {account.game_system.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Account ID: {account.account_id}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.game_system.type}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No game systems linked. Click the plus button to add one.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyAccount;