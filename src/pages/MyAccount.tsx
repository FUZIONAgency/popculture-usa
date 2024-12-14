import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Player } from '@/types/player';

const MyAccount = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

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
      </div>
    </div>
  );
};

export default MyAccount;