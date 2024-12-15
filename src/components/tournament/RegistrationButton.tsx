import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface RegistrationButtonProps {
  tournamentId: string;
  currentPlayer: any;
  registration: any;
}

export function RegistrationButton({ tournamentId, currentPlayer, registration }: RegistrationButtonProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateRegistrationMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!currentPlayer || !tournamentId) throw new Error('Missing required data');

      if (status === 'registered' && registration) {
        const { error } = await supabase
          .from('tournament_entries')
          .update({ status: 'registered' })
          .eq('id', registration.id);

        if (error) throw error;
      } else if (status === 'canceled' && registration) {
        const { error } = await supabase
          .from('tournament_entries')
          .update({ status: 'canceled' })
          .eq('id', registration.id);

        if (error) throw error;
      }
    },
    onSuccess: (_, status) => {
      toast({
        title: status === 'registered' 
          ? 'Successfully registered for tournament' 
          : 'Registration canceled',
        variant: "default"
      });
      // Invalidate both queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['tournament-registration'] });
      queryClient.invalidateQueries({ queryKey: ['tournament'] });
    },
    onError: (error) => {
      toast({
        title: 'Action failed',
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const handleRegister = () => {
    if (currentPlayer) {
      navigate(`/tournaments/${tournamentId}/register`);
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
}