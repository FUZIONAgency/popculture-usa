import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { UpcomingConventions } from "@/components/home/UpcomingConventions";

interface Convention {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: string;
}

interface FeaturedItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  type: 'convention' | 'tournament' | 'retailer';
}

const Index = () => {
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const { toast } = useToast();

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
            title: conventionData.name,
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
            image_url: tournamentData.image_url,
            type: 'tournament'
          });
        }

        if (retailerData) {
          items.push({
            id: retailerData.id,
            title: retailerData.name,
            description: retailerData.description,
            image_url: retailerData.store_photo,
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

  return (
    <div className="min-h-screen">
      <FeaturedCarousel items={featuredItems} />
      <UpcomingConventions conventions={conventions} />
    </div>
  );
};

export default Index;