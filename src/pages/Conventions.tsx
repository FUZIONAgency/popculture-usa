import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ConventionCalendar } from "@/components/ConventionCalendar";

// Function to get cached conventions
const getCachedConventions = () => {
  const cached = localStorage.getItem('conventions');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // Check if cache is less than 5 minutes old
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  }
  return null;
};

// Function to set cached conventions
const setCachedConventions = (data: any) => {
  localStorage.setItem('conventions', JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};

const Conventions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof conventions[0] | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const { data: conventions, isLoading } = useQuery({
    queryKey: ["conventions"],
    queryFn: async () => {
      // Try to get cached data first
      const cachedData = getCachedConventions();
      if (cachedData) {
        return cachedData;
      }

      // If no cache or expired, fetch from API
      const { data, error } = await supabase
        .from("conventions")
        .select("*")
        .order("start_date", { ascending: true });
      
      if (error) throw error;
      
      // Cache the new data
      setCachedConventions(data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });

  const nextTwoConventions = conventions?.slice(0, 2) || [];

  // Filter and sort conventions
  const filteredAndSortedConventions = conventions
    ? conventions
        .filter((convention) =>
          Object.values(convention)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (!sortConfig.key) return 0;
          
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        })
    : [];

  const handleSort = (key: keyof typeof conventions[0]) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('conventions');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Featured Conventions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Conventions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {nextTwoConventions.map((convention) => (
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

        {/* Calendar Section */}
        <section className="mb-12 -mx-4 px-4 bg-white shadow-md py-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Convention Calendar</h2>
            <ConventionCalendar conventions={conventions || []} />
          </div>
        </section>

        {/* All Conventions Table */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Conventions</h2>
            <Input
              placeholder="Search conventions..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("name")}
                  >
                    Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("start_date")}
                  >
                    Start Date {sortConfig.key === "start_date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("location")}
                  >
                    Location {sortConfig.key === "location" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("expected_attendees")}
                  >
                    Expected Attendees {sortConfig.key === "expected_attendees" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("status")}
                  >
                    Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedConventions.map((convention) => (
                  <TableRow key={convention.id}>
                    <TableCell>
                      <Link 
                        to={`/conventions/${convention.id}`}
                        className="text-primary hover:underline"
                      >
                        {convention.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(new Date(convention.start_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{convention.location}</TableCell>
                    <TableCell>{convention.expected_attendees?.toLocaleString() || 'TBD'}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        convention.status === 'upcoming' 
                          ? 'bg-primary/20 text-primary'
                          : convention.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {convention.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Host Tournament Section */}
        <section className="mb-12 bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Host a Tournament?</h2>
          <p className="mb-6 text-muted-foreground">
            Join our network of convention partners and host exciting tournaments at your venue.
          </p>
          <Button size="lg" variant="default">
            Apply to Host
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Conventions;