import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { RegistrationButton } from "@/components/tournament/RegistrationButton";

export default function TournamentDetail() {
  const { id } = useParams();

  const { data: tournament } = useQuery({
    queryKey: ["tournament", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: currentPlayer } = useQuery({
    queryKey: ['current-player'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error fetching player:', error);
        return null;
      }
      return data;
    },
  });

  const { data: registration } = useQuery({
    queryKey: ['tournament-registration', id, currentPlayer?.id],
    enabled: !!currentPlayer?.id && !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournament_entries')
        .select('*')
        .eq('tournament_id', id)
        .eq('player_id', currentPlayer.id)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  if (!tournament) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8">
            <p>Loading tournament details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <Card>
        <div className="h-[400px] relative">
          <img
            src={tournament.image_url || "/placeholder.svg"}
            alt={tournament.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl">{tournament.title}</CardTitle>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>
                {new Date(tournament.start_date).toLocaleDateString()} -{" "}
                {new Date(tournament.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{tournament.venue}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prize Pool</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">${tournament.prize_pool}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {tournament.current_participants}/{tournament.max_participants}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <RegistrationButton 
                  tournamentId={id || ''} 
                  currentPlayer={currentPlayer} 
                  registration={registration}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">About this Tournament</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{tournament.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}