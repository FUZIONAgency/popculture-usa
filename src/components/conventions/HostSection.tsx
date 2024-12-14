import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { HostApplicationForm } from "./HostApplicationForm";

export const HostSection = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <section className="mb-12 bg-muted p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Want to Host a Tournament?</h2>
        <p className="mb-6 text-muted-foreground">
          Join our network of convention partners and host exciting tournaments at your venue.
        </p>
        <Button size="lg" variant="default" onClick={() => setShowForm(true)}>
          Apply to Host
        </Button>
      </section>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tournament Host Application</DialogTitle>
          </DialogHeader>
          <HostApplicationForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};