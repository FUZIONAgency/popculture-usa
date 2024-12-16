import { RetailerGrid } from "./RetailerGrid";
import type { Retailer } from "@/types/retailer";

interface ConnectRetailerSectionProps {
  availableRetailers: Retailer[] | null;
  isLoadingRetailers: boolean;
  onConnect: (id: string) => void;
  onCancel: () => void;
}

export const ConnectRetailerSection = ({
  availableRetailers,
  isLoadingRetailers,
  onConnect,
  onCancel,
}: ConnectRetailerSectionProps) => {
  if (isLoadingRetailers) {
    return <p>Loading available retailers...</p>;
  }

  return (
    <div className="mt-4">
      <div className="mb-4">
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to connected retailers
        </button>
      </div>
      {availableRetailers?.length === 0 ? (
        <p className="text-gray-500">No retailers available to connect</p>
      ) : (
        <RetailerGrid
          retailers={availableRetailers || []}
          onConnect={onConnect}
          mode="available"
        />
      )}
    </div>
  );
};