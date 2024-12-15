import { Marker, Popup } from 'react-leaflet';
import type { Icon } from 'leaflet';
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
  return (
    <Marker 
      position={[retailer.lat, retailer.lng]} 
      icon={icon}
    >
      <Popup>
        <div className="text-sm">
          <h3 className="font-semibold">{retailer.name}</h3>
          <p>{retailer.address}</p>
        </div>
      </Popup>
    </Marker>
  );
};