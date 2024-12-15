import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { Player } from '@/types/player';

interface PlayerContextType {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  loading: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: playerData } = await supabase
            .from('players')
            .select('*')
            .eq('auth_id', session.user.id)
            .maybeSingle();

          setCurrentPlayer(playerData);
        }
      } catch (error) {
        console.error('Error fetching player:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: playerData } = await supabase
          .from('players')
          .select('*')
          .eq('auth_id', session.user.id)
          .maybeSingle();

        setCurrentPlayer(playerData);
      } else {
        setCurrentPlayer(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <PlayerContext.Provider value={{ currentPlayer, setCurrentPlayer, loading }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}