import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import RetailersMap from "@/components/retailers/RetailersMap";
import SearchBar from "@/components/retailers/SearchBar";
import type { Retailer } from "@/types/retailers";

export default function Retailers() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: retailers = [], isLoading } = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <RetailersMap retailers={filteredRetailers} />
    </div>
  );
}