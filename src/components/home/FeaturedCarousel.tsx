import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeaturedItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  type: 'convention' | 'tournament' | 'retailer';
}

interface FeaturedCarouselProps {
  items: FeaturedItem[];
}

export const FeaturedCarousel = ({ items }: FeaturedCarouselProps) => {
  const navigate = useNavigate();

  const handleFeaturedClick = (item: FeaturedItem) => {
    switch (item.type) {
      case 'convention':
        navigate(`/conventions/${item.id}`);
        break;
      case 'tournament':
        navigate(`/tournaments/${item.id}`);
        break;
      case 'retailer':
        navigate(`/retailers/${item.id}`);
        break;
    }
  };

  return (
    <section className="w-full h-[60vh] mb-12">
      <Carousel className="w-full h-full" autoRotate={true} autoRotateInterval={10000}>
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="h-full">
              <div 
                className="relative w-full h-full"
              >
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8">
                  <span className="text-sm uppercase tracking-wider mb-2">
                    Featured {item.type}
                  </span>
                  <h2 className="text-4xl font-bold mb-4 text-center">{item.title}</h2>
                  <p className="text-lg mb-6 text-center max-w-2xl">{item.description}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleFeaturedClick(item)}
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
};