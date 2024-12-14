import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import type { Player } from '@/types/player';
import type { PlayerGameAccount, GameSystem } from '@/types/game';
import { ProfileCard } from '@/components/account/ProfileCard';
import { PlayerCard } from '@/components/account/PlayerCard';
import { GameAccountsCard } from '@/components/account/GameAccountsCard';

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
            .eq('email', session.user.email)
            .single();

          if (playerError && playerError.code !== 'PGRST116') {
            throw playerError;
          }

          if (playerData) {
            setPlayer(playerData);

            // Get player game accounts with game system information
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
        <ProfileCard profile={profile} />
        <PlayerCard player={player} />
        <GameAccountsCard player={player} gameAccounts={gameAccounts} />
      </div>
    </div>
  );
};

export default MyAccount;
