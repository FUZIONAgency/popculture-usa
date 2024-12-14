import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RetailersMapProps {
  retailers: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
  }[];
}

export const RetailersMap = ({ retailers }: RetailersMapProps) => {
  // Calculate center position based on first retailer or default to a central US position
  const centerPosition: L.LatLngExpression = retailers.length > 0
    ? [retailers[0].lat, retailers[0].lng]
    : [39.8283, -98.5795]; // Center of the US

  return (
    <MapContainer
      center={centerPosition}
      zoom={4}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {retailers.map((retailer) => (
        <Marker
          key={retailer.id}
          position={[retailer.lat, retailer.lng] as L.LatLngExpression}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{retailer.name}</h3>
              <p>{retailer.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};