import { Link } from "react-router-dom";
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

interface Convention {
  id: string;
  name: string;
  start_date: string;
  location: string;
  expected_attendees: number;
  status: string;
}

interface ConventionsTableProps {
  conventions: Convention[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortConfig: {
    key: keyof Convention | null;
    direction: "asc" | "desc";
  };
  handleSort: (key: keyof Convention) => void;
}

export const ConventionsTable = ({
  conventions,
  searchTerm,
  setSearchTerm,
  sortConfig,
  handleSort,
}: ConventionsTableProps) => (
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
          {conventions.map((convention) => (
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
);