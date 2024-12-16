import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MapSearchProps {
  searchRadius: string;
  onSearchRadiusChange: (value: string) => void;
  onFindNearby: () => void;
}

export const MapSearch = ({ 
  searchRadius, 
  onSearchRadiusChange, 
  onFindNearby 
}: MapSearchProps) => {
  return (
    <div className="flex gap-2">
      <Input
        type="number"
        value={searchRadius}
        onChange={(e) => onSearchRadiusChange(e.target.value)}
        placeholder="Search radius (miles)"
        className="w-40"
      />
      <Button onClick={onFindNearby}>
        Find Nearby Retailers
      </Button>
    </div>
  );
};