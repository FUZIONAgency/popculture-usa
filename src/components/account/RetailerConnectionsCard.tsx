import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Plus } from "lucide-react";
import type { Player } from "@/types/player";
import { useRetailerConnections } from "@/hooks/use-retailer-connections";
import { RetailerListItem } from "./RetailerListItem";

interface RetailerConnectionsCardProps {
  player: Player | null;
}

export const RetailerConnectionsCard = ({ player }: RetailerConnectionsCardProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const {
    connectedRetailers,
    availableRetailers,
    isLoadingConnections,
    isLoadingRetailers,
    connectRetailer,
    disconnectRetailer,
  } = useRetailerConnections(player);

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
            {isLoadingRetailers ? (
              <p>Loading retailers...</p>
            ) : (
              <div className="space-y-2">
                {availableRetailers?.map((retailer) => (
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
              onClick={() => setIsConnecting(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};