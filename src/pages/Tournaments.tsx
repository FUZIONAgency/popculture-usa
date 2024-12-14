import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConventionCalendar } from "@/components/ConventionCalendar";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";

interface Tournament {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  venue: string;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  image_url: string;
  is_featured: boolean;
}

const TournamentCard = ({ tournament, featured = false }: { tournament: Tournament; featured?: boolean }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer animate-fade-up ${
        featured ? 'col-span-full' : ''
      }`}
      onClick={() => navigate(`/tournaments/${tournament.id}`)}
    >
      <div className={`relative ${featured ? 'h-[400px]' : 'h-[200px]'}`}>
        <img 
          src={tournament.image_url || "/placeholder.svg"} 
          alt={tournament.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {featured && (
          <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full text-white">
            Featured Tournament
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{tournament.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{tournament.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{tournament.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>${tournament.prize_pool}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{tournament.current_participants}/{tournament.max_participants}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Tournaments() {
  const isMobile = useIsMobile();
  const { data: tournaments } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as Tournament[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const featuredTournament = tournaments?.find((t) => t.is_featured) || tournaments?.[0];
  const otherTournaments = tournaments?.filter((t) => t.id !== featuredTournament?.id)?.slice(0, 3) || [];

  return (
    <div className="container py-8 space-y-8">
      {/* Featured Tournament */}
      {featuredTournament && (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Featured Tournament</h2>
          <TournamentCard tournament={featuredTournament} featured />
        </div>
      )}

      {/* Other Tournaments */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upcoming Tournaments</h2>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}>
          {otherTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </div>

      {/* Tournament Calendar */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Tournament Schedule</h2>
        <ConventionCalendar
          conventions={tournaments?.map((t) => ({
            id: t.id,
            name: t.title,
            start_date: t.start_date,
            end_date: t.end_date,
            description: t.description,
          })) || []}
        />
      </div>
    </div>
  );
}
