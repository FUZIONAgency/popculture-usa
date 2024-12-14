import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapMarker } from './MapMarker';
import { defaultIcon, nearbyIcon, userIcon } from '@/hooks/use-retailers-map';
import 'leaflet/dist/leaflet.css';

interface RetailersMapViewProps {
  retailers: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
  }>;
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
  // Increased height from 400px to 520px (30% increase)
  return (
    <MapContainer
      center={center}
      zoom={4}
      scrollWheelZoom={false}
      style={{ height: '520px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {retailers.map((retailer) => (
        <MapMarker
          key={retailer.id}
          retailer={retailer}
          icon={nearbyRetailerIds.has(retailer.id) ? nearbyIcon : defaultIcon}
        />
      ))}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};