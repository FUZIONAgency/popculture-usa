import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

const RetailerDetail = () => {
  const { id } = useParams();

  const { data: retailer, isLoading, error } = useQuery({
    queryKey: ['retailer', id],
    queryFn: async () => {
      if (!id) throw new Error('No retailer ID provided');

      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching retailer:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Retailer not found');
      }

      return data;
    },
    retry: false,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to load retailer details');
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !retailer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="py-8">
            <p className="text-center text-gray-600">
              {error instanceof Error ? error.message : 'Retailer not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{retailer.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {retailer.store_photo && (
            <div className="relative h-[400px] w-full">
              <img
                src={retailer.store_photo}
                alt={retailer.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          
          {retailer.description && (
            <p className="text-gray-600">{retailer.description}</p>
          )}

          <div className="space-y-2">
            <p><strong>Address:</strong> {retailer.address}</p>
            <p><strong>City:</strong> {retailer.city}</p>
            <p><strong>State:</strong> {retailer.state}</p>
            <p><strong>ZIP:</strong> {retailer.zip}</p>
            {retailer.phone && <p><strong>Phone:</strong> {retailer.phone}</p>}
            {retailer.email && <p><strong>Email:</strong> {retailer.email}</p>}
          </div>

          {retailer.website_url && (
            <div>
              <Button
                variant="outline"
                onClick={() => window.open(retailer.website_url, '_blank')}
                className="flex items-center gap-2"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RetailerDetail;