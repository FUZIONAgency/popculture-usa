import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', users: 4000 },
  { month: 'Feb', users: 3000 },
  { month: 'Mar', users: 2000 },
  { month: 'Apr', users: 2780 },
  { month: 'May', users: 1890 },
  { month: 'Jun', users: 2390 },
];

const Metrics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Platform Metrics</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">100,000+</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">50+</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Partner Venues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">200+</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Statistics</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">User Engagement</h3>
              <p className="text-muted-foreground">Average session duration: 15 minutes</p>
            </div>
            <div>
              <h3 className="font-semibold">Event Success Rate</h3>
              <p className="text-muted-foreground">98% of events meet attendance goals</p>
            </div>
            <div>
              <h3 className="font-semibold">Community Growth</h3>
              <p className="text-muted-foreground">25% month-over-month growth in active users</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Metrics;