import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { RetailerListItem } from "@/components/account/RetailerListItem";
import { useRetailerConnections } from "@/hooks/use-retailer-connections";
import { useRetailersMap } from "@/hooks/use-retailers-map";
import { MapSearch } from "@/components/retailers/MapSearch";
import { toast } from "sonner";

const MyRetailers = () => {
  const [playerId, setPlayerId] = useState<string | null>(localStorage.getItem('playerId'));
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchRadius, setSearchRadius] = useState('10');
  
  const {
    connectedRetailers,
    availableRetailers,
    isLoadingConnections,
    isLoadingRetailers,
    connectRetailer,
    disconnectRetailer,
  } = useRetailerConnections({ id: playerId } as any);

  const {
    findNearbyRetailers,
    nearbyRetailerIds,
  } = useRetailersMap(availableRetailers || []);

  const filteredRetailers = availableRetailers?.filter(retailer => {
    const matchesSearch = searchQuery === '' || 
      retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery === '') {
      return nearbyRetailerIds.has(retailer.id);
    }
    return matchesSearch;
  }).slice(0, 10);

  useEffect(() => {
    if (!searchQuery && availableRetailers?.length) {
      findNearbyRetailers();
    }
  }, [searchQuery, availableRetailers]);

  if (!playerId) {
    return (
      <div className="container py-8">
        <p>Please create a player profile first.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Retailers</h1>
        <Button 
          variant="destructive" 
          onClick={() => setIsConnecting(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Connect a Retailer
        </Button>
      </div>

      {isLoadingConnections ? (
        <p>Loading your connections...</p>
      ) : connectedRetailers?.length === 0 ? (
        <p className="text-gray-500">No connected retailers</p>
      ) : (
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Connected Retailers</h2>
          {connectedRetailers?.map((retailer) => (
            <RetailerListItem
              key={retailer.id}
              retailer={retailer}
              onDisconnect={(id) => {
                disconnectRetailer.mutate(id);
                toast.success('Retailer disconnected successfully');
              }}
              mode="connected"
            />
          ))}
        </div>
      )}

      {isConnecting && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Retailers</h2>
            <Button
              variant="ghost"
              onClick={() => setIsConnecting(false)}
            >
              Cancel
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search retailers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {!searchQuery && (
              <MapSearch
                searchRadius={searchRadius}
                onSearchRadiusChange={setSearchRadius}
                onFindNearby={findNearbyRetailers}
              />
            )}
          </div>

          {isLoadingRetailers ? (
            <p>Loading retailers...</p>
          ) : (
            <div className="space-y-4">
              {filteredRetailers?.map((retailer) => (
                <RetailerListItem
                  key={retailer.id}
                  retailer={retailer}
                  onConnect={(id) => {
                    connectRetailer.mutate(id);
                    toast.success('Connected to retailer successfully');
                  }}
                  mode="available"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRetailers;