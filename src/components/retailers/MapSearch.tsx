import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="flex gap-4 items-end">
      <div className="space-y-2">
        <Label htmlFor="search-radius">Miles Range</Label>
        <Input
          id="search-radius"
          type="number"
          value={searchRadius}
          onChange={(e) => onSearchRadiusChange(e.target.value)}
          placeholder="Search radius (miles)"
          className="w-40"
        />
      </div>
      <Button onClick={onFindNearby}>
        Find Nearby Retailers
      </Button>
    </div>
  );
};