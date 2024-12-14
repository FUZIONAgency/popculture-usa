import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import type { GameSystem } from '@/types/game';
import type { Player } from '@/types/player';

const AddGameAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [gameSystems, setGameSystems] = useState<GameSystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [accountId, setAccountId] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const initialize = async () => {
      // Get current user's email
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        navigate('/auth');
        return;
      }

      // Get player record
      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (!playerData) {
        navigate('/create-player');
        return;
      }

      setPlayer(playerData);

      // Get game systems
      const { data: gameSystemsData } = await supabase
        .from('game_systems')
        .select('*')
        .eq('status', 'active');

      setGameSystems(gameSystemsData || []);
      setLoading(false);
    };

    initialize();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player || !selectedSystem || !accountId) return;

    setSubmitting(true);
    
    const { error } = await supabase
      .from('player_game_accounts')
      .insert({
        player_id: player.id,
        game_system_id: selectedSystem,
        account_id: accountId,
      });

    setSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add game account. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: "Game account added successfully.",
      });
      navigate('/my-account');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Game Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gameSystem">Game System</Label>
              <Select
                value={selectedSystem}
                onValueChange={setSelectedSystem}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a game system" />
                </SelectTrigger>
                <SelectContent>
                  {gameSystems.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountId">Account ID</Label>
              <Input
                id="accountId"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="Enter your account ID"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/my-account')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Game Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddGameAccount;