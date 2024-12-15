import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapMarker } from './MapMarker';
import { defaultIcon, nearbyIcon, userIcon } from '@/hooks/use-retailers-map';
import type { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Retailer {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface RetailersMapViewProps {
  retailers: Retailer[];
  center: [number, number];
  userLocation: [number, number] | null;
  nearbyRetailerIds: Set<string>;
}

export const RetailersMapView = ({ 
  retailers, 
  center, 
  userLocation, 
  nearbyRetailerIds 
}: RetailersMapViewProps) => {
  return (
    <MapContainer
      center={center}
      zoom={4}
      scrollWheelZoom={false}
      style={{ height: '520px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {retailers.map((retailer) => (
        <MapMarker
          key={retailer.id}
          retailer={retailer}
          icon={nearbyRetailerIds.has(retailer.id) ? nearbyIcon : defaultIcon}
        />
      ))}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon as any}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};