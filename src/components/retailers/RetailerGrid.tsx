import { RetailerListItem } from "@/components/account/RetailerListItem";
import type { Retailer } from "@/types/retailer";
import type { PlayerRetailerConnection } from "@/types/player";

interface RetailerGridProps {
  retailers: Retailer[];
  onConnect?: (id: string) => void;
  onDisconnect?: (retailerId: string, playerRetailerId: string) => void;
  mode: 'connected' | 'available';
  playerRetailerConnections?: PlayerRetailerConnection[];
}

export const RetailerGrid = ({ 
  retailers,
  onConnect,
  onDisconnect,
  mode,
  playerRetailerConnections
}: RetailerGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {retailers.map((retailer) => {
        const playerRetailerId = playerRetailerConnections?.find(
          conn => conn.retailer_id === retailer.id
        )?.id;

        return (
          <RetailerListItem
            key={retailer.id}
            retailer={retailer}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            mode={mode}
            playerRetailerId={playerRetailerId}
          />
        );
      })}
    </div>
  );
};