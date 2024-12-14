import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";

const ConventionDetail = () => {
  const { id } = useParams();

  const { data: convention, isLoading } = useQuery({
    queryKey: ["convention", id],
    queryFn: async () => {
      if (!id) throw new Error("No convention ID provided");
      
      const { data, error } = await supabase
        .from("conventions")
        .select("id, name, description, start_date, end_date, location, venue, expected_attendees, image_url, website_url, registration_url")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching convention:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!convention) {
    return <div>Convention not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{convention.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="w-full flex justify-center">
              <img
                src={convention.image_url}
                alt={convention.name}
                className="w-1/3 h-auto object-contain rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays className="h-5 w-5" />
                <span>
                  {format(new Date(convention.start_date), "MMMM d, yyyy")} - {format(new Date(convention.end_date), "MMMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{convention.venue}, {convention.location}</span>
              </div>

              <p className="text-gray-700 mt-4">{convention.description}</p>

              {convention.expected_attendees && (
                <p className="text-gray-600">
                  Expected Attendees: {convention.expected_attendees}
                </p>
              )}

              <div className="flex gap-4 mt-6">
                {convention.registration_url && (
                  <Button asChild>
                    <a href={convention.registration_url} target="_blank" rel="noopener noreferrer">
                      Register Now
                    </a>
                  </Button>
                )}
                
                {convention.website_url && (
                  <Button variant="outline" asChild>
                    <a href={convention.website_url} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConventionDetail;