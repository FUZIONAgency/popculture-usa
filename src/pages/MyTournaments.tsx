import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Tournament } from '@/types/tournament';
import type { Player } from '@/types/player';

const MyTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyTournaments = async () => {
      try {
        // First get the current player
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setLoading(false);
          return;
        }

        // Get the player record for the current user
        const { data: playerData } = await supabase
          .from('players')
          .select('id')
          .eq('auth_id', session.user.id)
          .single();

        if (!playerData) {
          setLoading(false);
          return;
        }

        // Get tournament entries and related tournament data for the player
        const { data: tournamentEntries } = await supabase
          .from('tournament_entries')
          .select(`
            tournament:tournaments (
              id,
              title,
              description,
              start_date,
              end_date,
              venue,
              location,
              status,
              tournament_type,
              prize_pool
            )
          `)
          .eq('player_id', playerData.id);

        // Extract tournaments from entries and filter out any null values
        const playerTournaments = tournamentEntries
          ?.map(entry => entry.tournament)
          .filter((tournament): tournament is Tournament => tournament !== null) || [];

        setTournaments(playerTournaments);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    getMyTournaments();
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
      <h1 className="text-3xl font-bold mb-6">My Tournaments</h1>
      {tournaments.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">You haven't registered for any tournaments yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <Card key={tournament.id}>
              <CardHeader>
                <CardTitle>{tournament.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{tournament.description}</p>
                  <div className="text-sm">
                    <p>Start: {new Date(tournament.start_date).toLocaleDateString()}</p>
                    <p>End: {new Date(tournament.end_date).toLocaleDateString()}</p>
                    <p>Location: {tournament.venue}</p>
                    {tournament.prize_pool && (
                      <p>Prize Pool: ${tournament.prize_pool.toLocaleString()}</p>
                    )}
                    {tournament.tournament_type && (
                      <p>Type: {tournament.tournament_type}</p>
                    )}
                    <p className="mt-2 font-medium">Status: {tournament.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTournaments;