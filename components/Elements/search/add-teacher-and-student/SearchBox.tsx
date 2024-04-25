import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TStudentSearchBy, TStudentsFetchFilterParams } from "@/features/students/types";
import { TTeacherSearchBy, TTeachersFetchFilterParams } from "@/features/teachers";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TOrderBy } from "@/types/typings";
import { cn } from "@/utils/cn";
import { validateSearchBoxInputs } from "@/utils/validators";
import { CheckIcon, Filter, Search, SortDesc } from "lucide-react";
import { Dispatch, SetStateAction, memo, useRef, useState } from "react";

type TTeacherSearchByComboboxAttributes = {
  searchFields: { [key in keyof TTeacherSearchBy]: string };
  searchByValues: (keyof TTeacherSearchBy)[];
  setSearchByValues: (value: (keyof TTeacherSearchBy)[]) => void;
};

type TStudentSearchByComboboxAttributes = {
  searchFields: { [key in keyof TStudentSearchBy]: string };
  searchByValues: (keyof TStudentSearchBy)[];
  setSearchByValues: (value: (keyof TStudentSearchBy)[]) => void;
};

type TSearchByComboboxProps = {
  searchingFor: "teachers" | "students";
} & (TTeacherSearchByComboboxAttributes | TStudentSearchByComboboxAttributes);

const SearchByCombobox = memo(function SearchByCombobox({
  searchFields,
  searchByValues,
  setSearchByValues,
}: TSearchByComboboxProps) {
  const { isOpen, toggle } = useDisclosure();

  const handleSelect = (currentValue: string) => {
    const currValueTyped = currentValue as keyof typeof searchFields;

    if (searchByValues.includes(currValueTyped)) {
      setSearchByValues(searchByValues.filter((value) => value !== currValueTyped));
    } else {
      setSearchByValues([...searchByValues, currValueTyped]);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={toggle}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[150px] justify-between"
        >
          <span className="truncate">
            {searchByValues.length === 0
              ? "Search by..."
              : searchByValues.length === 1
              ? searchFields[searchByValues[0]]
              : "Multiple"}
          </span>
          <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Search by..." />
          <CommandEmpty>No search by found.</CommandEmpty>
          <CommandGroup>
            {Object.entries(searchFields).map(([key, value]) => (
              <CommandItem key={key} value={key} onSelect={handleSelect}>
                {value}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    searchByValues.includes(key as keyof TTeacherSearchBy)
                      ? "text-primary-500"
                      : "text-transparent"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

type TOrderByDropdownProps = {
  setOrderByValue: (value: TOrderBy | undefined) => void;
  orderByValue?: TOrderBy;
};

const OrderByDropdown = memo(function OrderByDropdown({
  setOrderByValue,
  orderByValue,
}: TOrderByDropdownProps) {
  const handleSelect = (value: TOrderBy) => {
    setOrderByValue(orderByValue === value ? undefined : value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SortDesc size={16} className="opacity-80" />
          Order by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem onSelect={() => handleSelect("asc")} checked={orderByValue === "asc"}>
          Ascending
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem onSelect={() => handleSelect("desc")} checked={orderByValue === "desc"}>
          Descending
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

type TTeacherAttributes = {
  searchFields: { [key in keyof TTeacherSearchBy]: string };
  setFilterParams: Dispatch<SetStateAction<TTeachersFetchFilterParams | undefined>>;
};

type TStudentAttributes = {
  searchFields: { [key in keyof TStudentSearchBy]: string };
  setFilterParams: Dispatch<SetStateAction<TStudentsFetchFilterParams | undefined>>;
};

type TSearchBoxTypes = {
  searchingFor: "teachers" | "students";
  className?: string;
} & (TTeacherAttributes | TStudentAttributes);

export function SearchBox({ setFilterParams, searchFields, searchingFor, className }: TSearchBoxTypes) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchByValues, setSearchByValues] = useState<(keyof typeof searchFields)[]>([]);
  const [orderByValue, setOrderByValue] = useState<TOrderBy>();
  const [inputErrors, setInputErrors] = useState<{ query?: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchInputRef.current) return;

    const query = searchInputRef.current.value;

    const { isValid, errors } = validateSearchBoxInputs({ query, searchByValues, orderByValue });

    if (!isValid) {
      setInputErrors(errors);
      return;
    }

    setInputErrors({});

    setFilterParams({
      query,
      searchBy: searchByValues.length ? searchByValues : undefined,
      orderBy: orderByValue,
    });
  };

  return (
    <form className={`${cn("flex gap-5 items-center", className)}`} onSubmit={handleSubmit}>
      <div className="flex-1 flex gap-2 items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            className={`py-5 pl-11 pr-4 dark:bg-slate-900 ${inputErrors?.query ? "border-red-500/60" : ""}`}
            placeholder={`Search ${searchingFor}...`}
            ref={searchInputRef}
          />
          <span className="absolute inset-y-0 left-2 flex items-center pl-2">
            <Search size={18} strokeWidth={3} className="opacity-50" />
          </span>
        </div>

        <Button type="submit" variant="default" size={"icon"}>
          <Search size={18} strokeWidth={3} />
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <SearchByCombobox
          searchingFor={searchingFor}
          searchFields={searchFields}
          searchByValues={searchByValues}
          setSearchByValues={setSearchByValues}
        />

        <OrderByDropdown setOrderByValue={setOrderByValue} orderByValue={orderByValue} />
      </div>
    </form>
  );
}
