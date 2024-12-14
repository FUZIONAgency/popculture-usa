import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedRetailerProps {
  retailer: {
    id: string;
    name: string;
    description: string | null;
    carousel_image: string | null;
  };
}

export const FeaturedRetailer = ({ retailer }: FeaturedRetailerProps) => {
  const navigate = useNavigate();

  if (!retailer) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Featured Retailer</h2>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          <CarouselItem>
            <div 
              className="relative h-[400px] cursor-pointer"
              onClick={() => navigate(`/retailers/${retailer.id}`)}
            >
              <img
                src={retailer.carousel_image || ''}
                alt={retailer.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-3xl font-bold mb-2">{retailer.name}</h3>
                  <p className="text-lg">{retailer.description}</p>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};