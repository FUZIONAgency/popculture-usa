import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { Retailer } from "@/types/retailer";

const CreateGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [selectedRetailerId, setSelectedRetailerId] = useState<string | null>(null);

  // Fetch retailers for the select box
  const { data: retailers, isLoading: isLoadingRetailers } = useQuery({
    queryKey: ['retailers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return data as Retailer[];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get the current player from localStorage
      const currentPlayerStr = localStorage.getItem('currentPlayer');
      if (!currentPlayerStr) {
        throw new Error("No player information found");
      }
      const currentPlayer = JSON.parse(currentPlayerStr);

      // Create the campaign
      const { data: campaign, error: campaignError } = await supabase
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
            game_system_id: '00000000-0000-0000-0000-000000000000', // You might want to make this configurable
            retailer_id: selectedRetailerId // Add the selected retailer ID
          }
        ])
        .select()
        .single();

      if (campaignError || !campaign) {
        throw campaignError || new Error("Failed to create campaign");
      }

      // Create the campaign_players record for the owner using currentPlayer
      const { error: playerRecordError } = await supabase
        .from('campaign_players')
        .insert([
          {
            campaign_id: campaign.id,
            player_id: currentPlayer.id,
            role_type: 'owner',
            status: 'active'
          }
        ]);

      if (playerRecordError) {
        throw playerRecordError;
      }

      toast({
        title: "Success!",
        description: "Your game has been created.",
      });

      navigate('/games');
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Create a New Game</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Retailer (Optional)</label>
          <Select
            value={selectedRetailerId || ""}
            onValueChange={(value) => setSelectedRetailerId(value || null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a retailer (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No retailer</SelectItem>
              {retailers?.map((retailer) => (
                <SelectItem key={retailer.id} value={retailer.id}>
                  {retailer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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