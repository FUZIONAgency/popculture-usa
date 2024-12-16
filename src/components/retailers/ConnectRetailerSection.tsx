import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RetailerFilters } from "./RetailerFilters";
import { RetailerGrid } from "./RetailerGrid";
import type { Retailer } from "@/types/retailer";

interface ConnectRetailerSectionProps {
  availableRetailers: Retailer[] | undefined;
  isLoadingRetailers: boolean;
  onConnect: (id: string) => void;
  onCancel: () => void;
}

export const ConnectRetailerSection = ({
  availableRetailers,
  isLoadingRetailers,
  onConnect,
  onCancel,
}: ConnectRetailerSectionProps) => {
  const [nameFilter, setNameFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const filteredRetailers = availableRetailers
    ?.filter(retailer => 
      retailer.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      retailer.city.toLowerCase().includes(cityFilter.toLowerCase()) &&
      retailer.state.toLowerCase().includes(stateFilter.toLowerCase())
    )
    .slice(0, 10); // Limit to top 10 results

  return (
    <div className="mt-4 space-y-4">
      <h4 className="font-medium">Select a retailer to connect with:</h4>
      
      <RetailerFilters
        nameFilter={nameFilter}
        cityFilter={cityFilter}
        stateFilter={stateFilter}
        onNameFilterChange={setNameFilter}
        onCityFilterChange={setCityFilter}
        onStateFilterChange={setStateFilter}
      />

      {isLoadingRetailers ? (
        <p>Loading retailers...</p>
      ) : (
        <RetailerGrid
          retailers={filteredRetailers || []}
          onConnect={onConnect}
          mode="available"
        />
      )}

      <Button
        variant="ghost"
        onClick={() => {
          onCancel();
          setNameFilter("");
          setCityFilter("");
          setStateFilter("");
        }}
      >
        Cancel
      </Button>
    </div>
  );
};