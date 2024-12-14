import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentRetailersProps {
  retailers: Array<{
    id: string;
    name: string;
    description: string | null;
    address: string;
    city: string;
    state: string;
    zip: string;
  }>;
}

export const RecentRetailers = ({ retailers }: RecentRetailersProps) => {
  const navigate = useNavigate();

  if (!retailers?.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Recent Retailers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {retailers.map((retailer) => (
          <Card 
            key={retailer.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/retailers/${retailer.id}`)}
          >
            <CardHeader>
              <CardTitle>{retailer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{retailer.description}</p>
              <p className="mt-2">
                {retailer.address}, {retailer.city}, {retailer.state} {retailer.zip}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};