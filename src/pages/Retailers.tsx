import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RetailersMap } from "@/components/retailers/RetailersMap";
import { FeaturedRetailer } from "@/components/retailers/FeaturedRetailer";
import { RecentRetailers } from "@/components/retailers/RecentRetailers";
import { Loader2 } from "lucide-react";

const Retailers = () => {
  const { data: featuredRetailer, isLoading: isFeaturedLoading } = useQuery({
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

  const { data: recentRetailers, isLoading: isRecentLoading } = useQuery({
    queryKey: ['recentRetailers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: mapRetailers, isLoading: isMapLoading } = useQuery({
    queryKey: ['mapRetailers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retailers')
        .select('id, name, lat, lng, address');
      
      if (error) throw error;
      return data;
    },
  });

  if (isMapLoading || isFeaturedLoading || isRecentLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {featuredRetailer && <FeaturedRetailer retailer={featuredRetailer} />}
      {recentRetailers && <RecentRetailers retailers={recentRetailers} />}
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