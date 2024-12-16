import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";
import { useState } from "react";

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-black w-[300px]">
        <div className="flex flex-col gap-6 mt-8" onClick={() => setOpen(false)}>
          <NavLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
};