"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TCountry } from "@/types/typings";
import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, forwardRef, useState } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

type TProps = {
  searchingFor: string;
  data: TCountry[];
};

const Combobox = forwardRef<HTMLButtonElement, TProps>(({ searchingFor, data, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          ref={ref}
          {...props}
        >
          {value
            ? data.find((country) => country.name.common.toLowerCase() === value.toLowerCase())?.name.common
            : `Search ${searchingFor}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandEmpty>No {searchingFor} found.</CommandEmpty>
          <CommandGroup>
            {data.map((country) => (
              <CommandItem
                key={country.cca2}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn("mr-2 h-4 w-4", value === country.name.common ? "opacity-100" : "opacity-0")}
                />
                {country.name.common}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandInput placeholder="Search country..." />
        </Command>
      </PopoverContent>
    </Popover>
  );
});

Combobox.displayName = "Combobox";

export default Combobox;
