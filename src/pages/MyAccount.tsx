import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import type { Player } from '@/types/player';
import type { PlayerGameAccount, GameSystem } from '@/types/game';
import { ProfileCard } from '@/components/account/ProfileCard';
import { PlayerCard } from '@/components/account/PlayerCard';
import { GameAccountsCard } from '@/components/account/GameAccountsCard';
import { RetailerConnectionsCard } from '@/components/account/RetailerConnectionsCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

const MyAccount = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameAccounts, setGameAccounts] = useState<(PlayerGameAccount & { game_system: GameSystem })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const getProfileAndPlayer = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/auth');
          return;
        }

        // First create profile if it doesn't exist
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (checkError && checkError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: session.user.id,
                email: session.user.email,
                username: session.user.email?.split('@')[0] // Default username from email
              }
            ])
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
          setIsNewUser(true);
        } else if (checkError) {
          throw checkError;
        } else {
          setProfile(existingProfile);
        }

        // Get player data if it exists
        if (session.user.email) {
          const { data: playerData, error: playerError } = await supabase
            .from('players')
            .select('*')
            .eq('email', session.user.email);

          if (playerError) {
            throw playerError;
          }

          // Check if we got any player data
          if (playerData && playerData.length > 0) {
            setPlayer(playerData[0]);

            // Get player game accounts with game system information
            const { data: gameAccountsData, error: gameAccountsError } = await supabase
              .from('player_game_accounts')
              .select(`
                *,
                game_system:game_systems(*)
              `)
              .eq('player_id', playerData[0].id);

            if (gameAccountsError) throw gameAccountsError;

            if (gameAccountsData) {
              setGameAccounts(gameAccountsData);
              if (gameAccountsData.length === 0) {
                setIsNewUser(true);
              }
            }
          } else {
            setIsNewUser(true);
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
      
      {isNewUser && !player && (
        <Alert variant="default" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Welcome to Pop Culture USA!</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal list-inside space-y-2">
              <li>First, you need to create your player account.</li>
              <li>Second, connect your Ultraman League registration number by choosing the Ultraman TCG game system and entering the number assigned by Tsuburaya.</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}

      {isNewUser && player && gameAccounts.length === 0 && (
        <Alert variant="default" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Thank you for creating your player record</AlertTitle>
          <AlertDescription>
            Now you need to register your Ultraman League ID number by clicking on Add Game and selecting Ultraman TCG. 
            You should have been assigned a Tsuburaya ID number starting with 'us-9999999'.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-6">
        <ProfileCard profile={profile} />
        <PlayerCard player={player} />
        <GameAccountsCard player={player} gameAccounts={gameAccounts} />
        <RetailerConnectionsCard player={player} />
      </div>
    </div>
  );
};

export default MyAccount;