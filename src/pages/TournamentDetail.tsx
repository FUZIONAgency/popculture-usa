import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function TournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const updateRegistrationMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!currentPlayer || !id) throw new Error('Missing required data');

      if (status === 'registered' && registration) {
        // Update existing canceled registration
        const { error } = await supabase
          .from('tournament_entries')
          .update({ status: 'registered' })
          .eq('id', registration.id);

        if (error) throw error;
      } else if (status === 'canceled' && registration) {
        // Cancel existing registration
        const { error } = await supabase
          .from('tournament_entries')
          .update({ status: 'canceled' })
          .eq('id', registration.id);

        if (error) throw error;
      }
    },
    onSuccess: (_, status) => {
      toast.success(
        status === 'registered' 
          ? 'Successfully registered for tournament' 
          : 'Registration canceled'
      );
    },
    onError: (error) => {
      toast.error('Action failed', {
        description: error.message
      });
    },
  });

  const handleRegister = () => {
    if (currentPlayer) {
      navigate(`/tournaments/${id}/register`);
    } else {
      toast({
        title: "Registration Unavailable",
        description: "Please create a player profile to register.",
        variant: "destructive"
      });
    }
  };

  const handleCancelRegistration = () => {
    updateRegistrationMutation.mutate('canceled');
  };

  const handleRegisterAgain = () => {
    updateRegistrationMutation.mutate('registered');
  };

  const renderRegistrationButton = () => {
    if (!currentPlayer) {
      return (
        <Button 
          disabled
          className="w-full"
          variant="secondary"
        >
          Create Player Profile First
        </Button>
      );
    }

    if (!registration) {
      return (
        <Button 
          onClick={handleRegister} 
          className="w-full"
        >
          Register Now
        </Button>
      );
    }

    if (registration.status === 'registered') {
      return (
        <Button 
          onClick={handleCancelRegistration} 
          variant="destructive"
          className="w-full"
        >
          Cancel Registration
        </Button>
      );
    }

    if (registration.status === 'canceled') {
      return (
        <Button 
          onClick={handleRegisterAgain}
          variant="destructive" 
          className="w-full"
        >
          Register Again
        </Button>
      );
    }

    return null;
  };

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
                {renderRegistrationButton()}
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