import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-8">
      <Input
        type="text"
        placeholder="Search retailers by name, city, or state..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-2xl mx-auto text-lg"
      />
    </div>
  );
}