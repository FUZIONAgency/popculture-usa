import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert([
          {
            title,
            description,
            min_players: minPlayers,
            max_players: maxPlayers,
            status: 'active',
            type: 'standard',
            price: 0,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (campaign) {
        // Create campaign_players entry for the creator
        const { data: playerData } = await supabase
          .from('players')
          .select('id')
          .eq('auth_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (playerData) {
          await supabase
            .from('campaign_players')
            .insert([
              {
                campaign_id: campaign.id,
                player_id: playerData.id,
                role_type: 'owner',
                status: 'active',
              }
            ]);
        }

        toast({
          title: "Success!",
          description: "Your game has been created.",
        });

        navigate('/games');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Create a New Game</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter game title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe your game"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Players</label>
            <Input
              type="number"
              value={minPlayers}
              onChange={(e) => setMinPlayers(Number(e.target.value))}
              required
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Players</label>
            <Input
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              required
              min={1}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/games')}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
            Create Game
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateGame;