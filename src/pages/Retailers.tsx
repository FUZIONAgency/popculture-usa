import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RetailersMap } from "@/components/retailers/RetailersMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Retailers = () => {
  const navigate = useNavigate();

  const { data: featuredRetailer } = useQuery({
    queryKey: ['featuredRetailer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_featured', true)
        .not('carousel_image', 'is', null)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: recentRetailers } = useQuery({
    queryKey: ['recentRetailers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: mapRetailers } = useQuery({
    queryKey: ['mapRetailers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('id, name, lat, lng, address');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Featured Retailer Carousel */}
      {featuredRetailer && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Featured Retailer</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div 
                  className="relative h-[400px] cursor-pointer"
                  onClick={() => navigate(`/retailers/${featuredRetailer.id}`)}
                >
                  <img
                    src={featuredRetailer.carousel_image}
                    alt={featuredRetailer.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <h3 className="text-3xl font-bold mb-2">{featuredRetailer.name}</h3>
                      <p className="text-lg">{featuredRetailer.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      )}

      {/* Recent Retailers */}
      {recentRetailers && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Retailers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentRetailers.map((retailer) => (
              <Card 
                key={retailer.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/retailers/${retailer.id}`)}
              >
                <CardHeader>
                  <CardTitle>{retailer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{retailer.description}</p>
                  <p className="mt-2">
                    {retailer.address}, {retailer.city}, {retailer.state} {retailer.zip}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Map */}
      {mapRetailers && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Find Retailers</h2>
          <RetailersMap retailers={mapRetailers} />
        </section>
      )}
    </div>
  );
};

export default Retailers;