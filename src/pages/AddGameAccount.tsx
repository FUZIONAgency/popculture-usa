import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { AddGameAccountForm } from '@/components/account/AddGameAccountForm';
import type { Player } from '@/types/player';

const AddGameAccount = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlayer = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/auth');
          return;
        }

        if (session.user.email) {
          const { data: playerData, error: playerError } = await supabase
            .from('players')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (playerError) throw playerError;
          setPlayer(playerData);
        }
      } catch (error) {
        console.error('Error fetching player:', error);
        navigate('/my-account');
      } finally {
        setLoading(false);
      }
    };

    getPlayer();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!player) {
    return null;
  }

  return (
    <div className="container py-8">
      <AddGameAccountForm player={player} />
    </div>
  );
};

export default AddGameAccount;