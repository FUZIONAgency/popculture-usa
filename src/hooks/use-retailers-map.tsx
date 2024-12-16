import { useState } from 'react';
import { toast } from "sonner";
import L from 'leaflet';

// Create custom icons for different states
export const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const nearbyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Retailer {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

export const useRetailersMap = (retailers: Retailer[]) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchRadius, setSearchRadius] = useState<string>("10");
  const [nearbyRetailerIds, setNearbyRetailerIds] = useState<Set<string>>(new Set());

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

  const findNearbyRetailers = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation([userLat, userLng]);

          // Filter retailers within the specified radius
          const nearbyRetailers = retailers.filter(retailer => {
            const distance = calculateDistance(userLat, userLng, retailer.lat, retailer.lng);
            return distance <= Number(searchRadius);
          });

          setNearbyRetailerIds(new Set(nearbyRetailers.map(r => r.id)));
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

  const defaultCenter: [number, number] = retailers.length > 0
    ? [
        retailers.reduce((sum, r) => sum + r.lat, 0) / retailers.length,
        retailers.reduce((sum, r) => sum + r.lng, 0) / retailers.length,
      ]
    : [39.8283, -98.5795]; // Center of USA

  return {
    userLocation,
    searchRadius,
    setSearchRadius,
    nearbyRetailerIds,
    findNearbyRetailers,
    defaultCenter,
  };
};