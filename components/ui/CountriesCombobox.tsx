"use client";

import { cn } from "@/lib/utils";
import { TCountry } from "@/types/typings";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, SetStateAction, memo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TComboboxProps = {
  searchingFor: string;
  countriesData: TCountry[];
  selectedCountry: string;
  setSelectedCountry: Dispatch<SetStateAction<string>>;
};

export const CountriesCombobox = memo(function CountriesCombobox({
  searchingFor,
  countriesData,
  selectedCountry,
  setSelectedCountry,
}: TComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedCountry
            ? countriesData.find(
                (country) => country.name.common.toLowerCase() === selectedCountry.toLowerCase()
              )?.name.common
            : `Search ${searchingFor}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="max-h-[300px]">
          <CommandEmpty>No {searchingFor} found.</CommandEmpty>
          <CommandGroup className="overflow-y-auto">
            {countriesData.map((country) => (
              <CommandItem
                key={country.cca2}
                onSelect={(currentValue) => {
                  setSelectedCountry(currentValue === selectedCountry ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCountry === country.name.common.toLowerCase() ? "opacity-100" : "opacity-0"
                  )}
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
