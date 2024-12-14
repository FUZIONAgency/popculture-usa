import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import type { Player } from '@/types/player';

const formSchema = z.object({
  gameSystemId: z.string().min(1, 'Please select a game system'),
  accountId: z.string().min(1, 'Account ID is required'),
  status: z.enum(['active', 'inactive', 'pending']),
});

interface AddGameAccountFormProps {
  player: Player;
}

export const AddGameAccountForm = ({ player }: AddGameAccountFormProps) => {
  const [gameSystems, setGameSystems] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'active',
    },
  });

  useEffect(() => {
    const fetchGameSystems = async () => {
      const { data, error } = await supabase
        .from('game_systems')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching game systems:', error);
        return;
      }

      setGameSystems(data || []);
    };

    fetchGameSystems();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from('player_game_accounts').insert([
      {
        player_id: player.id,
        game_system_id: values.gameSystemId,
        account_id: values.accountId,
        status: values.status,
      },
    ]);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add game account. Please try again.',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Game account added successfully.',
    });
    navigate('/my-account');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Game Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="gameSystemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game System</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a game system" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gameSystems.map((system) => (
                        <SelectItem key={system.id} value={system.id}>
                          {system.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your account ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate('/my-account')}>
                Cancel
              </Button>
              <Button type="submit">Add Game Account</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};