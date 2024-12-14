import { Button } from "@/components/ui/button";

const MediaKit = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Media Kit</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">About Pop Culture USA</h2>
        <p className="text-muted-foreground mb-6">
          Pop Culture USA is the premier platform for gaming conventions, tournaments, and community events across the United States.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Monthly Active Users</h3>
            <p className="text-3xl font-bold">100K+</p>
          </div>
          
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Annual Events</h3>
            <p className="text-3xl font-bold">500+</p>
          </div>
          
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Partner Venues</h3>
            <p className="text-3xl font-bold">200+</p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Brand Assets</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Logo Package</h3>
            <p className="text-muted-foreground mb-4">
              Download our logo in various formats and sizes.
            </p>
            <Button>Download Logos</Button>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-4">Brand Guidelines</h3>
            <p className="text-muted-foreground mb-4">
              Access our comprehensive brand guidelines.
            </p>
            <Button>Download Guidelines</Button>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Press Contact</h2>
        <p className="text-muted-foreground">
          For press inquiries, please contact:<br />
          press@popcultureusa.com
        </p>
      </section>
    </div>
  );
};

export default MediaKit;