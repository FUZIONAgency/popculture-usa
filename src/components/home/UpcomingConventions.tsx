import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Convention {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: string;
}

interface UpcomingConventionsProps {
  conventions: Convention[];
}

export const UpcomingConventions = ({ conventions }: UpcomingConventionsProps) => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-12 pt-96">
      <h2 className="text-3xl font-bold mb-8">Upcoming Conventions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {conventions.map((convention) => (
          <div 
            key={convention.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate(`/conventions/${convention.id}`)}
          >
            <img 
              src={convention.image_url} 
              alt={convention.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{convention.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {format(new Date(convention.start_date), 'MMM dd, yyyy')} - {format(new Date(convention.end_date), 'MMM dd, yyyy')}
              </p>
              <p className="text-gray-700 line-clamp-3">{convention.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};