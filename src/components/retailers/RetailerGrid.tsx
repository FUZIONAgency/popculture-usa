import { RetailerListItem } from "@/components/account/RetailerListItem";
import type { Retailer } from "@/types/retailer";

interface RetailerGridProps {
  retailers: Retailer[];
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  mode: 'connected' | 'available';
}

export const RetailerGrid = ({ 
  retailers,
  onConnect,
  onDisconnect,
  mode
}: RetailerGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {retailers.map((retailer) => (
        <RetailerListItem
          key={retailer.id}
          retailer={retailer}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          mode={mode}
        />
      ))}
    </div>
  );
};