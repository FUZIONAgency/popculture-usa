import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, MapPin, Users } from "lucide-react";

const ConventionDetail = () => {
  const { id } = useParams();

  const { data: convention, isLoading } = useQuery({
    queryKey: ["convention", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conventions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!convention) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Convention not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{convention.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div 
            className="h-64 bg-cover bg-center rounded-lg shadow-lg"
            style={{ backgroundImage: `url(${convention.image_url})` }}
          />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-600" />
              <span>
                {format(new Date(convention.start_date), 'MMM dd, yyyy')} - {format(new Date(convention.end_date), 'MMM dd, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span>{convention.venue}, {convention.location}</span>
            </div>
            
            {convention.expected_attendees && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                <span>Expected Attendees: {convention.expected_attendees.toLocaleString()}</span>
              </div>
            )}
            
            {convention.registration_url && (
              <a
                href={convention.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register Now
              </a>
            )}
          </div>
        </div>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">About the Convention</h2>
          <p className="text-gray-700">{convention.description}</p>
          
          {convention.website_url && (
            <div className="mt-4">
              <a
                href={convention.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Convention Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConventionDetail;