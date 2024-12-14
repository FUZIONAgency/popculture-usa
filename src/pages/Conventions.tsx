import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";

// Convention colors array for rotating through different colors
const conventionColors = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#8B5CF6", // Vivid Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
];

const Conventions = () => {
  const { data: conventions, isLoading } = useQuery({
    queryKey: ["conventions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conventions")
        .select("*")
        .order("start_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const nextTwoConventions = conventions?.slice(0, 2) || [];
  
  // Assign a color to each convention
  const calendarDates = conventions?.map((conv, index) => ({
    start: new Date(conv.start_date),
    end: new Date(conv.end_date),
    title: conv.name,
    color: conventionColors[index % conventionColors.length], // Rotate through colors
  })) || [];

  // Custom styles for calendar events
  const modifiersStyles = calendarDates.reduce((acc, event, index) => {
    const color = conventionColors[index % conventionColors.length];
    acc[`convention-${index}`] = {
      backgroundColor: color,
      color: '#ffffff',
      borderRadius: '4px',
    };
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Featured Conventions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Conventions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {nextTwoConventions.map((convention) => (
              <Link 
                key={convention.id} 
                to={`/conventions/${convention.id}`}
                className="transition-transform hover:scale-105"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{convention.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={convention.image_url} 
                      alt={convention.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <p className="text-muted-foreground mb-2">
                      {format(new Date(convention.start_date), 'MMM dd, yyyy')} - 
                      {format(new Date(convention.end_date), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-muted-foreground">
                      {convention.venue}, {convention.location}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Calendar Section - Now Full Width */}
        <section className="mb-12 -mx-4 px-4 bg-white shadow-md py-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Convention Calendar</h2>
            <div className="w-full">
              <Calendar 
                mode="range"
                selected={{
                  from: calendarDates[0]?.start,
                  to: calendarDates[calendarDates.length - 1]?.end
                }}
                modifiers={{
                  ...calendarDates.reduce((acc, _, index) => ({
                    ...acc,
                    [`convention-${index}`]: { 
                      from: calendarDates[index].start,
                      to: calendarDates[index].end 
                    }
                  }), {})
                }}
                modifiersStyles={modifiersStyles}
                className="w-full border rounded-lg p-4"
              />
            </div>
          </div>
        </section>

        {/* All Conventions Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Conventions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {conventions?.map((convention) => (
              <Link 
                key={convention.id} 
                to={`/conventions/${convention.id}`}
                className="transition-transform hover:scale-105"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{convention.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={convention.image_url} 
                      alt={convention.name}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                    <p className="text-muted-foreground mb-2">
                      {format(new Date(convention.start_date), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-muted-foreground">
                      {convention.venue}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Host Tournament Section */}
        <section className="mb-12 bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Host a Tournament?</h2>
          <p className="mb-6 text-muted-foreground">
            Join our network of convention partners and host exciting tournaments at your venue.
          </p>
          <Button size="lg" variant="default">
            Apply to Host
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Conventions;