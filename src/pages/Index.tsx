import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
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
        const [conventionResponse, tournamentResponse, retailerResponse] = await Promise.allSettled([
          supabase
            .from('conventions')
            .select('id, name, description, carousel_image')
            .eq('is_featured', true)
            .single(),
          supabase
            .from('tournaments')
            .select('id, title, description, carousel_image')
            .eq('is_featured', true)
            .single(),
          supabase
            .from('retailers')
            .select('id, name, description, carousel_image')
            .eq('is_featured', true)
            .single()
        ]);

        const items: FeaturedItem[] = [];
        
        if (conventionResponse.status === 'fulfilled' && conventionResponse.value.data) {
          items.push({
            id: conventionResponse.value.data.id,
            title: conventionResponse.value.data.name,
            description: conventionResponse.value.data.description,
            image_url: conventionResponse.value.data.carousel_image || '',
            type: 'convention'
          });
        }

        if (tournamentResponse.status === 'fulfilled' && tournamentResponse.value.data) {
          items.push({
            id: tournamentResponse.value.data.id,
            title: tournamentResponse.value.data.title,
            description: tournamentResponse.value.data.description,
            image_url: tournamentResponse.value.data.carousel_image || '',
            type: 'tournament'
          });
        }

        if (retailerResponse.status === 'fulfilled' && retailerResponse.value.data) {
          items.push({
            id: retailerResponse.value.data.id,
            title: retailerResponse.value.data.name,
            description: retailerResponse.value.data.description,
            image_url: retailerResponse.value.data.carousel_image || '',
            type: 'retailer'
          });
        }

        setFeaturedItems(items);
      } catch (error) {
        console.error('Error fetching featured items:', error);
        toast({
          title: "Error",
          description: "Failed to load featured items. Please try again later.",
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
          description: "Failed to load conventions. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchFeaturedItems();
    fetchConventions();
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Pop Culture Conventions | Your Ultimate Convention Directory</title>
        <meta name="description" content="Discover the best pop culture conventions, comic cons, and gaming events. Find upcoming conventions, get event details, and connect with fellow fans." />
        <meta property="og:title" content="Pop Culture Conventions | Your Ultimate Convention Directory" />
        <meta property="og:description" content="Discover the best pop culture conventions, comic cons, and gaming events. Find upcoming conventions, get event details, and connect with fellow fans." />
        <meta name="keywords" content="pop culture conventions, comic con, gaming conventions, anime conventions, cosplay events" />
      </Helmet>
      <div className="min-h-screen">
        <FeaturedCarousel items={featuredItems} />
        <UpcomingConventions conventions={conventions} />
      </div>
    </>
  );
};

export default Index;