import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";

interface Convention {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: string;
}

interface FeaturedConvention {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

interface FeaturedTournament {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

interface FeaturedRetailer {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

type FeaturedItem = (FeaturedConvention | FeaturedTournament | FeaturedRetailer) & {
  type: 'convention' | 'tournament' | 'retailer';
};

const Index = () => {
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        // Fetch featured convention
        const { data: conventionData } = await supabase
          .from('conventions')
          .select('id, name, description, image_url')
          .eq('is_featured', true)
          .single();

        // Fetch featured tournament
        const { data: tournamentData } = await supabase
          .from('tournaments')
          .select('id, title, description, image_url')
          .eq('is_featured', true)
          .single();

        // Fetch featured retailer
        const { data: retailerData } = await supabase
          .from('retailers')
          .select('id, name, description, store_photo')
          .eq('is_featured', true)
          .single();

        const items: FeaturedItem[] = [];
        
        if (conventionData) {
          items.push({
            id: conventionData.id,
            title: conventionData.name, // Changed from title to name
            description: conventionData.description,
            image_url: conventionData.image_url,
            type: 'convention'
          });
        }

        if (tournamentData) {
          items.push({
            id: tournamentData.id,
            title: tournamentData.title,
            description: tournamentData.description,
            image_url: tournamentData.image_url || 'https://kwpptrhywkyuzadwxgdl.supabase.co/storage/v1/object/public/Carousel/PopCultureUltramanBlue.avif?t=2024-12-14T04%3A05%3A59.997Z',
            type: 'tournament'
          });
        }

        if (retailerData) {
          items.push({
            id: retailerData.id,
            title: retailerData.name, // Changed from title to name
            description: retailerData.description,
            image_url: retailerData.store_photo || '/placeholder.svg', // Changed from image_url to store_photo
            type: 'retailer'
          });
        }

        setFeaturedItems(items);
      } catch (error) {
        console.error('Error fetching featured items:', error);
        toast({
          title: "Error",
          description: "Failed to load featured items",
          variant: "destructive",
        });
      }
    };

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

    fetchFeaturedItems();
    fetchConventions();
  }, [toast]);

  const handleFeaturedClick = (item: FeaturedItem) => {
    switch (item.type) {
      case 'convention':
        navigate(`/conventions/${item.id}`);
        break;
      case 'tournament':
        navigate(`/tournaments/${item.id}`);
        break;
      case 'retailer':
        navigate(`/retailers/${item.id}`);
        break;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Featured Items Carousel Section */}

{/* Featured Items Carousel Section */}
<section className="w-full h-[60vh] mb-12">
  <Carousel className="w-full h-full" autoRotate={true} autoRotateInterval={10000}>
    <CarouselContent>
      {featuredItems.map((item, index) => (
              <CarouselItem key={index} className="h-full">
                <div 
                  className="relative w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image_url})` }}
                >
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8">
                    <span className="text-sm uppercase tracking-wider mb-2">
                      Featured {item.type}
                    </span>
                    <h2 className="text-4xl font-bold mb-4 text-center">{item.title}</h2>
                    <p className="text-lg mb-6 text-center max-w-2xl">{item.description}</p>
                    <Button 
                      variant="outline" 
                      onClick={() => handleFeaturedClick(item)}
                      className="text-white border-white hover:bg-white hover:text-black"
                    >
                      Learn More
                    </Button>
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
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/conventions/${convention.id}`)}
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
