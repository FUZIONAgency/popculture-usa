import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import type { MapContainerProps } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Retailer {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export default function Retailers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: retailers = [], isLoading } = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Retailer[];
    },
  });

  const filteredRetailers = retailers.filter((retailer) =>
    retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    retailer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    retailer.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRetailerClick = (id: string) => {
    navigate(`/retailers/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const centerPosition: LatLngExpression = [39.8283, -98.5795]; // Center of USA

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search retailers by name, city, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-2xl mx-auto text-lg"
        />
      </div>

      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={centerPosition}
          zoom={4}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredRetailers.map((retailer) => (
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
    </div>
  );
}