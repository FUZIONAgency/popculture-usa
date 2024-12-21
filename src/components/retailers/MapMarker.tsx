import { Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import type { Icon } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface Retailer {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface MapMarkerProps {
  retailer: Retailer;
  icon?: Icon;
}

export const MapMarker = ({ retailer, icon }: MapMarkerProps) => {
  const navigate = useNavigate();

  return (
    <Marker 
      position={[retailer.lat, retailer.lng]} 
      icon={icon}
    >
      <Popup>
        <div className="text-sm space-y-2">
          <h3 className="font-semibold">{retailer.name}</h3>
          <p>{retailer.address}</p>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={() => navigate(`/retailers/${retailer.id}`)}
          >
            <Info className="mr-2 h-4 w-4" />
            More Info
          </Button>
        </div>
      </Popup>
    </Marker>
  );
};