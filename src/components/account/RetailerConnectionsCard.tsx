import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Plus } from "lucide-react";
import type { Player } from "@/types/player";
import { useRetailerConnections } from "@/hooks/use-retailer-connections";
import { RetailerGrid } from "../retailers/RetailerGrid";
import { ConnectRetailerSection } from "../retailers/ConnectRetailerSection";

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
    playerRetailerConnections
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
          <RetailerGrid
            retailers={connectedRetailers || []}
            onDisconnect={(retailerId: string, playerRetailerId: string) => {
              disconnectRetailer.mutate({ retailerId, playerRetailerId });
            }}
            mode="connected"
            playerRetailerConnections={playerRetailerConnections}
          />
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
          <ConnectRetailerSection
            availableRetailers={availableRetailers}
            isLoadingRetailers={isLoadingRetailers}
            onConnect={(id) => connectRetailer.mutate(id)}
            onCancel={() => setIsConnecting(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};