import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { Retailer } from "@/types/retailer";

interface RetailerListItemProps {
  retailer: Retailer;
  onDisconnect?: (retailerId: string, playerRetailerId: string) => void;
  onConnect?: (retailerId: string) => void;
  mode: 'connected' | 'available';
  playerRetailerId?: string;
}

export const RetailerListItem = ({ 
  retailer, 
  onDisconnect, 
  onConnect, 
  mode,
  playerRetailerId 
}: RetailerListItemProps) => {
  return (
    <div className="flex flex-col h-full justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div>
        {mode === 'connected' ? (
          <Link to={`/retailers/${retailer.id}`} className="font-medium hover:text-primary">
            {retailer.name}
          </Link>
        ) : (
          <p className="font-medium">{retailer.name}</p>
        )}
        <p className="text-sm text-gray-500">{retailer.city}, {retailer.state}</p>
      </div>
      <div className="mt-4">
        {mode === 'connected' && onDisconnect && playerRetailerId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDisconnect(playerRetailerId)}
            className="text-gray-500 hover:text-red-600 w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        )}
        {mode === 'available' && onConnect && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onConnect(retailer.id)}
            className="w-full"
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};