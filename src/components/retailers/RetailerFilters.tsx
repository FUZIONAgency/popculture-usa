import { Input } from "@/components/ui/input";

interface RetailerFiltersProps {
  nameFilter: string;
  cityFilter: string;
  stateFilter: string;
  onNameFilterChange: (value: string) => void;
  onCityFilterChange: (value: string) => void;
  onStateFilterChange: (value: string) => void;
}

export const RetailerFilters = ({
  nameFilter,
  cityFilter,
  stateFilter,
  onNameFilterChange,
  onCityFilterChange,
  onStateFilterChange,
}: RetailerFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row md:gap-4 space-y-3 md:space-y-0 w-full">
      <Input
        placeholder="Filter by name"
        value={nameFilter}
        onChange={(e) => onNameFilterChange(e.target.value)}
        className="w-full"
      />
      <Input
        placeholder="Filter by city"
        value={cityFilter}
        onChange={(e) => onCityFilterChange(e.target.value)}
        className="w-full"
      />
      <Input
        placeholder="Filter by state"
        value={stateFilter}
        onChange={(e) => onStateFilterChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};