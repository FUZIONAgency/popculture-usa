import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Tournament } from '@/types/tournament';
import type { Player } from '@/types/player';

const MyTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyTournaments = async () => {
      try {
        // First check localStorage for currentPlayer
        const currentPlayerStr = localStorage.getItem('currentPlayer');
        if (!currentPlayerStr) {
          console.log('No current player found in localStorage');
          setLoading(false);
          return;
        }

        const currentPlayer = JSON.parse(currentPlayerStr) as Player;
        console.log('Current player from localStorage:', currentPlayer);

        // Get tournament entries and related tournament data for the player
        const { data: tournamentEntries, error } = await supabase
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
              prize_pool
            )
          `)
          .eq('player_id', currentPlayer.id);

        if (error) {
          console.error('Error fetching tournament entries:', error);
          setLoading(false);
          return;
        }

        console.log('Tournament entries:', tournamentEntries);

        // Extract tournaments from entries and filter out any null values
        const playerTournaments = tournamentEntries
          ?.map(entry => entry.tournament)
          .filter((tournament): tournament is Tournament => tournament !== null) || [];

        console.log('Player tournaments:', playerTournaments);
        setTournaments(playerTournaments);
      } catch (error) {
        console.error('Error in getMyTournaments:', error);
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
            <Card 
              key={tournament.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/tournaments/${tournament.id}`)}
            >
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