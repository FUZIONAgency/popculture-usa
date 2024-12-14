import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 text-center animate-stagger">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary"
          >
            Welcome to Pop Culture USA
          </motion.span>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Daily Dose of
            <br />
            <span className="text-gradient">Entertainment News</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Stay updated with the latest trends, celebrity news, and entertainment updates from across the USA
          </motion.p>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-12">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-stagger">
            {[1, 2, 3].map((item) => (
              <div key={item} className="glass-card hover-card rounded-2xl p-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                  Entertainment
                </span>
                <h3 className="text-xl font-semibold mb-3">Latest Hollywood Updates</h3>
                <p className="text-muted-foreground mb-4">
                  Breaking news and exclusive coverage of your favorite celebrities and entertainment.
                </p>
                <Button variant="ghost" className="group">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest updates and exclusive content
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;