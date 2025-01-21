import React, { useEffect, useRef } from "react";
import { CheckIcon, Globe } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Country } from "../../custom/country-select";
import { useCountries } from "../../hooks/use-countries";
import { ZFieldProps } from "../../types";

function CountryFlag({ countryCode }: { countryCode?: string }) {
  const { getCountry } = useCountries();
  const flag = countryCode && getCountry(countryCode)?.flag;
  if (flag)
    return (
      <span
        className="mr-2 h-4 w-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${flag})`,
        }}
      />
    );
  return <Globe className="mr-2 size-4 opacity-50" />;
}

export const CountryField: React.FC<ZFieldProps> = () => {
  const { setValue, getValues } = useFormContext();
  const popoverTriggerRef = useRef<HTMLButtonElement>(null); // Ref for the PopoverTrigger
  const { name } = useFormField();
  const { countries, getCountry } = useCountries();
  const value = getValues(name) as Country;

  useEffect(() => {
    if (value.countryName) {
      const country = countries.find(
        (c) => c.countryName === value.countryName
      );
      setValue(
        name,
        {
          countryCode: country?.countryCode,
          countryName: country?.countryName,
        },
        { shouldValidate: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (code: string) => {
    const country = getCountry(code);
    setValue(
      name,
      { countryCode: country?.countryCode, countryName: country?.countryName },
      { shouldValidate: true }
    );
    popoverTriggerRef.current?.click(); // Programmatically close the popover
  };
  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button
          variant={"outline"}
          className={cn(
            "w-full font-normal",
            !value && "text-muted-foreground"
          )}
          type="button"
        >
          <CountryFlag countryCode={value?.countryCode} />
          {value ? (
            <span className="mr-auto">{value.countryName}</span>
          ) : (
            <span className="mr-auto">Select a country</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map(({ countryName, emoji, countryCode }) => (
                  <CommandItem
                    key={`country-${countryCode}`}
                    className={cn(
                      "gap-2",
                      value?.countryCode === countryCode && "bg-muted"
                    )}
                    value={countryName}
                    onSelect={() => handleChange(countryCode)}
                  >
                    <span className="flex h-4 w-6 justify-center overflow-hidden">
                      {emoji}
                    </span>
                    <span className="flex-1 text-sm">{countryName}</span>
                    <CheckIcon
                      className={`ml-auto size-4 ${
                        value?.countryCode === countryCode
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
