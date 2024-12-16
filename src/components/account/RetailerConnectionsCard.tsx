import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Player } from "@/types/player";
import { useRetailerConnections } from "@/hooks/use-retailer-connections";
import { RetailerListItem } from "./RetailerListItem";

interface RetailerConnectionsCardProps {
  player: Player | null;
}

export const RetailerConnectionsCard = ({ player }: RetailerConnectionsCardProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  
  const {
    connectedRetailers,
    availableRetailers,
    isLoadingConnections,
    isLoadingRetailers,
    connectRetailer,
    disconnectRetailer,
  } = useRetailerConnections(player);

  useEffect(() => {
    if (player?.id) {
      localStorage.setItem('playerId', player.id);
    }
  }, [player?.id]);

  const filteredAvailableRetailers = availableRetailers
    ?.filter(retailer => 
      retailer.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      retailer.city.toLowerCase().includes(cityFilter.toLowerCase()) &&
      retailer.state.toLowerCase().includes(stateFilter.toLowerCase())
    )
    .slice(0, 10); // Limit to top 10 results

  if (!player) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Retailer Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingConnections ? (
          <p>Loading connections...</p>
        ) : connectedRetailers?.length === 0 ? (
          <p className="text-gray-500">No connected retailers</p>
        ) : (
          <div className="space-y-4">
            {connectedRetailers?.map((retailer) => (
              <RetailerListItem
                key={retailer.id}
                retailer={retailer}
                onDisconnect={(id) => disconnectRetailer.mutate(id)}
                mode="connected"
              />
            ))}
          </div>
        )}

        {!isConnecting ? (
          <Button
            variant="outline"
            onClick={() => setIsConnecting(true)}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Connect to Retailer
          </Button>
        ) : (
          <div className="mt-4 space-y-4">
            <h4 className="font-medium">Select a retailer to connect with:</h4>
            
            <div className="grid gap-3">
              <Input
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
              <Input
                placeholder="Filter by city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
              <Input
                placeholder="Filter by state"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              />
            </div>

            {isLoadingRetailers ? (
              <p>Loading retailers...</p>
            ) : (
              <div className="space-y-2">
                {filteredAvailableRetailers?.map((retailer) => (
                  <RetailerListItem
                    key={retailer.id}
                    retailer={retailer}
                    onConnect={(id) => connectRetailer.mutate(id)}
                    mode="available"
                  />
                ))}
              </div>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setIsConnecting(false);
                setNameFilter("");
                setCityFilter("");
                setStateFilter("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};