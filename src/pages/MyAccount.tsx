import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Player } from '@/types/player';
import type { PlayerGameAccount, GameSystem } from '@/types/game';

const MyAccount = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameAccounts, setGameAccounts] = useState<(PlayerGameAccount & { game_system: GameSystem })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfileAndPlayer = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/auth');
          return;
        }

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        setProfile({
          email: session.user.email,
          ...profileData
        });

        // Get player data if it exists
        if (session.user.email) {
          const { data: playerData, error: playerError } = await supabase
            .from('players')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (playerError && playerError.code !== 'PGRST116') {
            throw playerError;
          }

          if (playerData) {
            setPlayer(playerData);

            // Get player game accounts
            const { data: gameAccountsData, error: gameAccountsError } = await supabase
              .from('player_game_accounts')
              .select(`
                *,
                game_system:game_systems(*)
              `)
              .eq('player_id', playerData.id);

            if (gameAccountsError) throw gameAccountsError;

            if (gameAccountsData) {
              setGameAccounts(gameAccountsData.map(account => ({
                ...account,
                game_system: account.game_system[0]
              })));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfileAndPlayer();
  }, [navigate]);

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
        <Card>
          <CardHeader>
            <CardTitle>Game Systems</CardTitle>
          </CardHeader>
          <CardContent>
            {player ? (
              <div className="space-y-4">
                {gameAccounts.length > 0 ? (
                  gameAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{account.game_system.name}</h3>
                        <p className="text-sm text-gray-600">Account ID: {account.account_id}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 mb-4">No game accounts linked</p>
                )}
                <div className="flex justify-end">
                  <Button 
                    className="w-32 h-32"
                    variant="outline"
                    onClick={() => navigate('/add-game-account')}
                  >
                    Add Game
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyAccount;