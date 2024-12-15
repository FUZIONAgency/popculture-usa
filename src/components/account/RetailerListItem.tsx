import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { Retailer } from "@/types/retailer";

interface RetailerListItemProps {
  retailer: Retailer;
  onDisconnect?: (retailerId: string) => void;
  onConnect?: (retailerId: string) => void;
  mode: 'connected' | 'available';
}

export const RetailerListItem = ({ 
  retailer, 
  onDisconnect, 
  onConnect, 
  mode 
}: RetailerListItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        {mode === 'connected' ? (
          <Link to={`/retailers/${retailer.id}`} className="font-medium hover:text-red-600">
            {retailer.name}
          </Link>
        ) : (
          <p className="font-medium">{retailer.name}</p>
        )}
        <p className="text-sm text-gray-500">{retailer.city}, {retailer.state}</p>
      </div>
      {mode === 'connected' && onDisconnect && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDisconnect(retailer.id)}
          className="text-gray-500 hover:text-red-600"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {mode === 'available' && onConnect && (
        <Button
          variant="outline"
          onClick={() => onConnect(retailer.id)}
        >
          Connect
        </Button>
      )}
    </div>
  );
};