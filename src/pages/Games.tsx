import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from 'react-helmet-async';

const Games = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Get current player from localStorage
  const currentPlayer = JSON.parse(localStorage.getItem('currentPlayer') || '{}');

  const { data: campaigns, isLoading, refetch } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data: campaignsData, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_players (
            player_id
          )
        `)
        .eq('status', 'active')  // Filter for active campaigns
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      // Transform the data to count players for each campaign
      const transformedCampaigns = campaignsData.map(campaign => ({
        ...campaign,
        current_players: campaign.campaign_players?.length || 0,
        isJoined: campaign.campaign_players?.some(
          (cp: { player_id: string }) => cp.player_id === currentPlayer?.id
        ) || false
      }));

      return transformedCampaigns;
    },
  });

  const handleJoinGame = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('campaign_players')
        .insert([
          {
            campaign_id: campaignId,
            player_id: currentPlayer.id,
            role_type: 'player',
            status: 'active'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You have successfully joined the game.",
      });

      // Refetch campaigns to update the UI
      refetch();
    } catch (error) {
      console.error('Error joining game:', error);
      toast({
        title: "Error",
        description: "Failed to join the game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveGame = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('campaign_players')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('player_id', currentPlayer.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You have left the game.",
      });

      // Refetch campaigns to update the UI
      refetch();
    } catch (error) {
      console.error('Error leaving game:', error);
      toast({
        title: "Error",
        description: "Failed to leave the game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Gaming Community & Events | Join Game Sessions</title>
        <meta name="description" content="Join gaming sessions, find players, and participate in community events. Create or join games, connect with fellow players, and enhance your gaming experience." />
        <meta property="og:title" content="Gaming Community & Events | Join Game Sessions" />
        <meta property="og:description" content="Join gaming sessions, find players, and participate in community events. Create or join games, connect with fellow players, and enhance your gaming experience." />
        <meta name="keywords" content="gaming community, game sessions, player matchmaking, gaming events, multiplayer games" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Active Games</h1>
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
              : 'md:grid-cols-3 lg:grid-cols-4'
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
                <CardFooter>
                  {campaign.isJoined ? (
                    <Button 
                      onClick={() => handleLeaveGame(campaign.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      Leave Game
                    </Button>
                  ) : (
                    campaign.current_players < campaign.max_players && (
                      <Button 
                        onClick={() => handleJoinGame(campaign.id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        Join Game
                      </Button>
                    )
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Games;
