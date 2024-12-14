import { Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icon } from 'leaflet';

interface MapMarkerProps {
  retailer: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
  };
  icon: Icon;
}

export const MapMarker = ({ retailer, icon }: MapMarkerProps) => {
  const navigate = useNavigate();

  return (
    <Marker
      position={[retailer.lat, retailer.lng]}
      icon={icon}
    >
      <Popup>
        <div className="space-y-2">
          <h3 className="font-bold">{retailer.name}</h3>
          <p>{retailer.address}</p>
          <Button 
            onClick={() => navigate(`/retailers/${retailer.id}`)}
            className="w-full"
          >
            Visit Now
          </Button>
        </div>
      </Popup>
    </Marker>
  );
};