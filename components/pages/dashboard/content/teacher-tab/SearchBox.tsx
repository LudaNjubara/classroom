import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchBox() {
  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Input type="text" className="py-5 pl-11 pr-4 dark:bg-slate-900" placeholder="Search for teachers" />
        <span className="absolute inset-y-0 left-2 flex items-center pl-2">
          <Search size={18} strokeWidth={3} className="opacity-50" />
        </span>
      </div>

      <div>
        <Button className="btn btn-primary">Search</Button>
      </div>
    </div>
  );
}

export default SearchBox;
