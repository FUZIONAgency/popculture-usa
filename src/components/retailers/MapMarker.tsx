import { Marker, Popup } from 'react-leaflet';
import type { Icon } from 'leaflet';
import { MarkerProps } from '@types/leaflet';

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
      icon={icon as any} // Type assertion needed due to react-leaflet typing issue
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