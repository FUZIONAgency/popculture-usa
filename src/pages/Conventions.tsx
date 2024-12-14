import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ConventionCalendar } from "@/components/ConventionCalendar";
import { UpcomingConventions } from "@/components/conventions/UpcomingConventions";
import { ConventionsTable } from "@/components/conventions/ConventionsTable";
import { HostSection } from "@/components/conventions/HostSection";
import { Tables } from "@/integrations/supabase/types";

type Convention = Tables<"conventions">;

// Function to get cached conventions
const getCachedConventions = () => {
  const cached = localStorage.getItem('conventions');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // Check if cache is less than 5 minutes old
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  }
  return null;
};

// Function to set cached conventions
const setCachedConventions = (data: Convention[]) => {
  localStorage.setItem('conventions', JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};

const Conventions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Tables<"conventions">["Row"] | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const { data: conventions, isLoading } = useQuery({
    queryKey: ["conventions"],
    queryFn: async () => {
      // Try to get cached data first
      const cachedData = getCachedConventions();
      if (cachedData) {
        return cachedData;
      }

      // If no cache or expired, fetch from API
      const { data, error } = await supabase
        .from("conventions")
        .select()
        .order("start_date", { ascending: true });
      
      if (error) throw error;
      
      // Cache the new data
      setCachedConventions(data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });

  const nextTwoConventions = conventions?.slice(0, 2) || [];

  // Filter and sort conventions
  const filteredAndSortedConventions = conventions
    ? conventions
        .filter((convention) =>
          Object.values(convention)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (!sortConfig.key) return 0;
          
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        })
    : [];

  const handleSort = (key: keyof Tables<"conventions">["Row"]) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('conventions');
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Conventions */}
      <UpcomingConventions conventions={nextTwoConventions} />

      {/* Calendar Section */}
      <section className="mb-12 -mx-4 px-4 bg-white shadow-md py-8">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">Convention Calendar</h2>
          <ConventionCalendar conventions={conventions || []} />
        </div>
      </section>

      {/* All Conventions Table */}
      <ConventionsTable 
        conventions={filteredAndSortedConventions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortConfig={sortConfig}
        handleSort={handleSort}
      />

      {/* Host Tournament Section */}
      <HostSection />
    </div>
  );
};

export default Conventions;