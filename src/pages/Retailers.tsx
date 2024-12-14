import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import RetailersMap from "@/components/retailers/RetailersMap";
import SearchBar from "@/components/retailers/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Retailer } from "@/types/retailers";

export default function Retailers() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: retailers = [], isLoading } = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .eq('status', 'active')
        .order("name");
      
      if (error) throw error;
      return data as Retailer[];
    },
  });

  const filteredRetailers = retailers.filter((retailer) =>
    retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    retailer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    retailer.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Find a Retailer</h1>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      {isLoading ? (
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <RetailersMap retailers={filteredRetailers} />
      )}
    </div>
  );
}