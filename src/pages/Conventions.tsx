import React, { useMemo, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import { ConventionCalendar } from "@/components/ConventionCalendar";
import { useIsMobile } from "@/hooks/use-mobile";

type Convention = Tables<"conventions">;

type SortConfig = {
  key: keyof Convention;
  direction: "asc" | "desc";
};

const Conventions = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const isMobile = useIsMobile();

  const { data: conventions, isLoading } = useQuery({
    queryKey: ["conventions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conventions")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const sortedConventions = useMemo(() => {
    let sortableConventions = [...(conventions || [])];
    if (sortConfig) {
      sortableConventions.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableConventions;
  }, [conventions, sortConfig]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Convention Calendar */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Convention Schedule</h2>
        <ConventionCalendar
          type="convention"
          conventions={conventions?.map((conv) => ({
            id: conv.id,
            name: conv.name,
            start_date: conv.start_date,
            end_date: conv.end_date,
            description: conv.description,
            type: 'convention'
          })) || []}
        />
      </div>

      {/* Convention Grid */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">All Conventions</h2>
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {sortedConventions.map((convention) => (
            <Link key={convention.id} to={`/conventions/${convention.id}`}>
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <img 
                    src={convention.image_url} 
                    alt={convention.name}
                    className="w-1/2 h-auto object-contain"
                  />
                </div>
                <h2 className="text-xl font-semibold">{convention.name}</h2>
                <p className="text-gray-500">{format(new Date(convention.start_date), "MMMM d, yyyy")}</p>
                <p className="mt-2 line-clamp-2 text-gray-600">{convention.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conventions;