import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface Convention {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: string;
}

const Index = () => {
  const [conventions, setConventions] = useState<Convention[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchConventions = async () => {
      try {
        const { data, error } = await supabase
          .from('conventions')
          .select('*')
          .eq('status', 'upcoming')
          .order('start_date', { ascending: true })
          .limit(3);

        if (error) throw error;
        setConventions(data || []);
      } catch (error) {
        console.error('Error fetching conventions:', error);
        toast({
          title: "Error",
          description: "Failed to load conventions",
          variant: "destructive",
        });
      }
    };

    fetchConventions();
  }, [toast]);

  const heroImages = [
    "/hero1.jpg",
    "/hero2.jpg",
    "/hero3.jpg"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="w-full h-[60vh] mb-12">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <div className="w-full h-full bg-black/40 flex items-center justify-center">
                    <h2 className="text-4xl md:text-6xl text-white font-bold">
                      Welcome to Pop Culture USA
                    </h2>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Upcoming Conventions Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Upcoming Conventions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {conventions.map((convention) => (
            <div 
              key={convention.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${convention.image_url})` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{convention.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {format(new Date(convention.start_date), 'MMM dd, yyyy')} - {format(new Date(convention.end_date), 'MMM dd, yyyy')}
                </p>
                <p className="text-gray-700 line-clamp-3">{convention.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;