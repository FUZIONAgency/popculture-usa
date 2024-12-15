import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const TournamentRegistration = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  const { data: tournament } = useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: currentPlayer } = useQuery({
    queryKey: ['current-player'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!currentPlayer || !tournamentId) throw new Error('Missing required data');

      const { error } = await supabase
        .from('tournament_entries')
        .insert({
          tournament_id: tournamentId,
          player_id: currentPlayer.id,
          status: 'registered',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Successfully registered for tournament');
      navigate(`/tournaments/${tournamentId}`);
    },
    onError: (error) => {
      toast.error('Failed to register', {
        description: error.message
      });
    },
  });

  if (!tournament) return <div>Loading...</div>;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tournament Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Tournament Details</h3>
            <p>{tournament.title}</p>
            <p className="text-sm text-gray-600">{tournament.description}</p>
          </div>

          <div>
            <h3 className="font-semibold">Registration Details</h3>
            <p className="text-sm text-gray-600">
              By registering, you agree to participate in this tournament and follow all tournament rules.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate(`/tournaments/${tournamentId}`)}>
              Cancel
            </Button>
            <Button onClick={() => registerMutation.mutate()}>
              Confirm Registration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentRegistration;