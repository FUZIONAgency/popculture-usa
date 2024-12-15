import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import type { PlayerGameAccount, GameSystem } from '@/types/game';
import { ProfileCard } from '@/components/account/ProfileCard';
import { PlayerCard } from '@/components/account/PlayerCard';
import { GameAccountsCard } from '@/components/account/GameAccountsCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';

const MyAccount = () => {
  const navigate = useNavigate();
  const { currentPlayer, loading: playerLoading } = usePlayer();
  const [profile, setProfile] = useState<any>(null);
  const [gameAccounts, setGameAccounts] = useState<(PlayerGameAccount & { game_system: GameSystem })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const getProfileAndGameAccounts = async () => {
      try {
        console.log('Fetching profile and game accounts...'); // Debug log
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('No session found, redirecting to auth'); // Debug log
          navigate('/auth');
          return;
        }

        console.log('Session user:', session.user); // Debug log

        // Get profile data
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('Profile fetch result:', { existingProfile, checkError }); // Debug log

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

        // Get game accounts if player exists
        if (currentPlayer) {
          console.log('Current player found, fetching game accounts:', currentPlayer); // Debug log
          const { data: gameAccountsData, error: gameAccountsError } = await supabase
            .from('player_game_accounts')
            .select(`
              *,
              game_system:game_systems(*)
            `)
            .eq('player_id', currentPlayer.id);

          if (gameAccountsError) throw gameAccountsError;

          console.log('Game accounts fetch result:', gameAccountsData); // Debug log

          if (gameAccountsData) {
            setGameAccounts(gameAccountsData);
            if (gameAccountsData.length === 0) {
              setIsNewUser(true);
            }
          }
        } else {
          console.log('No current player found, setting isNewUser to true'); // Debug log
          setIsNewUser(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!playerLoading) {
      getProfileAndGameAccounts();
    }
  }, [navigate, currentPlayer, playerLoading]);

  // Show loading state only when both loading states are true
  if (loading && playerLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      {isNewUser && !currentPlayer && (
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

      {isNewUser && currentPlayer && gameAccounts.length === 0 && (
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
        <PlayerCard player={currentPlayer} />
        <GameAccountsCard player={currentPlayer} gameAccounts={gameAccounts} />
      </div>
    </div>
  );
};

export default MyAccount;