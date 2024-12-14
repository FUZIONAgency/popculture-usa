import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import type { MapContainerProps } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Retailer } from "@/types/retailers";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RetailersMapProps {
  retailers: Retailer[];
}

export default function RetailersMap({ retailers }: RetailersMapProps) {
  const navigate = useNavigate();
  const centerPosition: LatLngExpression = [39.8283, -98.5795]; // Center of USA

  const handleRetailerClick = (id: string) => {
    navigate(`/retailers/${id}`);
  };

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        {...({center: centerPosition} as any)}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          {...({
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          } as any)}
        />
        {retailers.map((retailer) => (
          <Marker
            key={retailer.id}
            position={[retailer.lat, retailer.lng] as LatLngExpression}
            eventHandlers={{
              click: () => handleRetailerClick(retailer.id),
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{retailer.name}</h3>
                <p>{retailer.address}</p>
                <p>{`${retailer.city}, ${retailer.state}`}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}