import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";

interface Retailer {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  lat: number;
  lng: number;
  hours_of_operation: Record<string, string> | null;
  store_photo: string | null;
}

export default function RetailerDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: retailer, isLoading } = useQuery({
    queryKey: ["retailer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Retailer;
    },
  });

  if (isLoading || !retailer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {retailer.store_photo && (
            <img
              src={retailer.store_photo}
              alt={retailer.name}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{retailer.name}</h1>
            
            {retailer.description && (
              <p className="text-gray-600 mb-6">{retailer.description}</p>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-2">
                  <p>{retailer.address}</p>
                  <p>{`${retailer.city}, ${retailer.state} ${retailer.zip}`}</p>
                  {retailer.phone && <p>Phone: {retailer.phone}</p>}
                  {retailer.email && (
                    <p>Email: <a href={`mailto:${retailer.email}`} className="text-primary hover:underline">{retailer.email}</a></p>
                  )}
                  {retailer.website_url && (
                    <p>
                      <a href={retailer.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Visit Website
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {retailer.hours_of_operation && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Hours of Operation</h2>
                  <div className="space-y-1">
                    {Object.entries(retailer.hours_of_operation).map(([day, hours]) => (
                      <p key={day}>
                        <span className="font-medium">{day}:</span> {hours}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 h-[400px] rounded-lg overflow-hidden">
              <MapContainer
                center={[retailer.lat, retailer.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[retailer.lat, retailer.lng]}>
                  <Popup>
                    <div>
                      <h3 className="font-bold">{retailer.name}</h3>
                      <p>{retailer.address}</p>
                      <p>{`${retailer.city}, ${retailer.state}`}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}