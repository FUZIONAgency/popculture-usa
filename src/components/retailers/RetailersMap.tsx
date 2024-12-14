import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from "sonner";

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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchRadius, setSearchRadius] = useState<string>("10");
  
  // Calculate center point (average of all retailer locations or user location)
  const center = userLocation || (retailers.length > 0
    ? [
        retailers.reduce((sum, r) => sum + r.lat, 0) / retailers.length,
        retailers.reduce((sum, r) => sum + r.lng, 0) / retailers.length,
      ] as [number, number]
    : [39.8283, -98.5795] as [number, number]); // Center of USA

  const findNearbyRetailers = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation([userLat, userLng]);

          // Filter retailers within the specified radius (using Haversine formula)
          const nearbyRetailers = retailers.filter(retailer => {
            const distance = calculateDistance(userLat, userLng, retailer.lat, retailer.lng);
            return distance <= Number(searchRadius);
          });

          toast.success(`Found ${nearbyRetailers.length} retailers within ${searchRadius} miles`);
        },
        (error) => {
          toast.error("Error getting your location. Please try again.");
          console.error("Error getting location:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="number"
          value={searchRadius}
          onChange={(e) => setSearchRadius(e.target.value)}
          placeholder="Search radius (miles)"
          className="w-40"
        />
        <Button onClick={findNearbyRetailers}>
          Find Nearby Retailers
        </Button>
      </div>
      
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
          >
            <Popup>
              <div className="space-y-2">
                <h3 className="font-bold">{retailer.name}</h3>
                <p>{retailer.address}</p>
                <Button 
                  onClick={() => navigate(`/retailers/${retailer.id}`)}
                  className="w-full"
                >
                  Visit Now
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};