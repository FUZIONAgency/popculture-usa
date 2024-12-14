import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Convention {
  id: string;
  name: string;
  image_url: string;
  start_date: string;
  end_date: string;
  venue: string;
  location: string;
}

export const UpcomingConventions = ({ conventions }: { conventions: Convention[] }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-6">Upcoming Conventions</h2>
    <div className="grid md:grid-cols-2 gap-6">
      {conventions.map((convention) => (
        <Link 
          key={convention.id} 
          to={`/conventions/${convention.id}`}
          className="transition-transform hover:scale-105"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{convention.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={convention.image_url} 
                alt={convention.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-muted-foreground mb-2">
                {format(new Date(convention.start_date), 'MMM dd, yyyy')} - 
                {format(new Date(convention.end_date), 'MMM dd, yyyy')}
              </p>
              <p className="text-muted-foreground">
                {convention.venue}, {convention.location}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </section>
);