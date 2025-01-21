import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { parseDigits } from "libphonenumber-js";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useZField } from "../../context";
import { PhoneNumber } from "../../custom/phone-number";
import { useCountries } from "../../hooks/use-countries";
import { usePhone } from "../../hooks/use-phone";
import { ZFieldProps } from "../../types";

export const PhoneField: React.FC<ZFieldProps> = ({ field, path }) => {
  const { inputProps } = useZField(field, path);
  const { setValue, getValues } = useFormContext();
  const popoverTriggerRef = useRef<HTMLButtonElement>(null); // Ref for the PopoverTrigger
  const { name } = useFormField();
  const { countries, typing } = usePhone();
  const { getCountryName } = useCountries();
  const [selectedCountry, selectCountry] =
    useState<(typeof countries)[number]>();
  const value = getValues(name) as PhoneNumber;

  useEffect(() => {
    if (value.formatted) {
      const country = countries.find((c) => c.phoneCode === value.phoneCode);
      selectCountry(country);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSelect = (code: string) => {
    const country = countries.find((c) => c.countryCode === code);
    selectCountry(country);
    setValue(
      name,
      {
        value: country?.phoneCode,
        phoneCode: country?.phoneCode,
        formatted: country?.phoneCode,
      },
      { shouldValidate: false }
    );
    popoverTriggerRef.current?.click(); // Programmatically close the popover
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    let text = e.target.value;
    if (!text.startsWith("+")) text = "+" + text;
    const value = parseDigits(text);
    const formatted = typing.input(text);
    const phoneCode = typing.getCallingCode();
    setValue(
      name,
      {
        value,
        formatted,
        phoneCode,
      },
      { shouldValidate: true }
    );
    const country = typing.getCountry();
    if (country && selectedCountry?.countryCode !== country)
      selectCountry(countries.find((c) => c.countryCode === country));
  };
  return (
    <Popover>
      <div className="flex">
        <PopoverTrigger asChild ref={popoverTriggerRef}>
          <Button
            variant={"outline"}
            className={cn(
              "font-normal w-10 flex items-center justify-center border-r-0 rounded-r-none",
              !value && "text-muted-foreground"
            )}
            type="button"
            size="icon"
          >
            {selectedCountry ? (
              <span
                className="h-4 w-6 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${selectedCountry.flag})` }}
              />
            ) : (
              <Globe className="size-4 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <Input
          className="border-l-0 rounded-l-none"
          name={name}
          {...inputProps}
          value={value?.formatted || ""}
          onChange={handleChange}
        />
      </div>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map(({ countryCode, phoneCode, flag }) => (
                  <CommandItem
                    key={`country-${countryCode}`}
                    className={cn(
                      "gap-2",
                      value?.phoneCode === phoneCode && "bg-muted"
                    )}
                    value={countryCode}
                    onSelect={handleSelect}
                  >
                    <span
                      className="h-4 w-6 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${flag})` }}
                    />
                    <span>{getCountryName(countryCode)}</span>
                    <span className="ml-auto text-sm">+{phoneCode}</span>
                    <CheckIcon
                      className={`size-4 ${
                        value?.phoneCode === phoneCode
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
