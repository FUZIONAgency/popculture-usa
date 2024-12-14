import { Marker, Popup } from 'react-leaflet';
import type { Icon } from 'leaflet';
import type { Tables } from '@/integrations/supabase/types';

type Retailer = Tables<'retailers'>;

interface MapMarkerProps {
  retailer: Retailer;
  icon: Icon;
}

export const MapMarker = ({ retailer, icon }: MapMarkerProps) => {
  return (
    <Marker 
      position={[retailer.lat, retailer.lng]} 
      icon={icon as any}
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