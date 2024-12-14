import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function TournamentDetail() {
  const { id } = useParams();
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

  const handleRegister = () => {
    toast({
      title: "Registration Coming Soon",
      description: "Tournament registration will be available soon.",
    });
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
                <Button onClick={handleRegister} className="w-full">
                  Register Now
                </Button>
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