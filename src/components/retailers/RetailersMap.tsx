import { MapSearch } from './MapSearch';
import { RetailersMapView } from './RetailersMapView';
import { useRetailersMap } from '@/hooks/use-retailers-map';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Retailer {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface RetailersMapProps {
  retailers: Retailer[];
}

export const RetailersMap = ({ retailers }: RetailersMapProps) => {
  const {
    userLocation,
    searchRadius,
    setSearchRadius,
    nearbyRetailerIds,
    findNearbyRetailers,
    defaultCenter,
  } = useRetailersMap(retailers);

  const simplifiedRetailers = retailers.map(({ id, name, lat, lng, address }) => ({
    id,
    name,
    lat,
    lng,
    address
  }));

  return (
    <div className="space-y-4">
      <MapSearch 
        searchRadius={searchRadius}
        onSearchRadiusChange={setSearchRadius}
        onFindNearby={findNearbyRetailers}
      />
      
      <RetailersMapView
        retailers={simplifiedRetailers}
        center={defaultCenter}
        userLocation={userLocation}
        nearbyRetailerIds={nearbyRetailerIds}
      />
    </div>
  );
};