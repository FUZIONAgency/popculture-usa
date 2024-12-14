import { Button } from "@/components/ui/button";

export const HostSection = () => (
  <section className="mb-12 bg-muted p-8 rounded-lg text-center">
    <h2 className="text-2xl font-bold mb-4">Want to Host a Tournament?</h2>
    <p className="mb-6 text-muted-foreground">
      Join our network of convention partners and host exciting tournaments at your venue.
    </p>
    <Button size="lg" variant="default">
      Apply to Host
    </Button>
  </section>
);