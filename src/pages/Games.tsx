import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const Games = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (campaignsError) throw campaignsError;

      // Fetch player counts for each campaign
      const campaignsWithCounts = await Promise.all(
        campaignsData.map(async (campaign) => {
          const { count, error: countError } = await supabase
            .from('campaign_players')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', campaign.id);
          
          if (countError) throw countError;
          
          return {
            ...campaign,
            current_players: count || 0
          };
        })
      );

      return campaignsWithCounts;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Your Games</h1>
        <p className="text-lg text-muted-foreground mb-6">
          You can create a game and invite players to join you
        </p>
        <Button 
          onClick={() => navigate('/create-game')}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Create a Game
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading games...</div>
      ) : (
        <div className={`grid gap-6 ${
          isMobile 
            ? 'grid-cols-1' 
            : 'md:grid-cols-3 lg:grid-cols-5'
        }`}>
          {campaigns?.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{campaign.description}</p>
                <div className="mt-4">
                  <p className="text-sm">
                    Players: {campaign.current_players}/{campaign.max_players}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;