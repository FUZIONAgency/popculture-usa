import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
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
  const navigate = useNavigate();
  
  // Calculate center point (average of all retailer locations)
  const center = retailers.length > 0
    ? [
        retailers.reduce((sum, r) => sum + r.lat, 0) / retailers.length,
        retailers.reduce((sum, r) => sum + r.lng, 0) / retailers.length,
      ] as [number, number]
    : [39.8283, -98.5795] as [number, number]; // Center of USA

  return (
    <MapContainer
      center={center}
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
          position={[retailer.lat, retailer.lng] as [number, number]}
          eventHandlers={{
            click: () => navigate(`/retailers/${retailer.id}`),
          }}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{retailer.name}</h3>
              <p>{retailer.address}</p>
              <button
                className="text-blue-600 hover:underline mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/retailers/${retailer.id}`);
                }}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};