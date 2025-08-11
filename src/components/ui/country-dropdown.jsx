import { useCallback, useState, forwardRef, useEffect } from "react";

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// utils
import { cn } from "@/lib/utils";

// assets
import { ChevronDown, ChevronsUpDown, CheckIcon, Globe } from "lucide-react";
import { CircleFlag } from "react-circle-flags";

// data
import { countries } from "country-data-list";

const CountryDropdownComponent = (
  {
    options = countries.all.filter(
      (country) =>
        country.emoji &&
        country.status !== "deleted" &&
        country.ioc !== "PRK" &&
        country.name === "Germany"
    ),
    onChange,
    value,
    disabled = false,
    placeholder = "Select a country",
    slim = false,
    inline = false,
    multiple = false,
    textSize = "base",
    className,
    ...props
  },
  ref
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    // Skip if no value
    if (!value) {
      if (selectedCountries.length > 0) {
        setSelectedCountries([]);
      }
      return;
    }

    // For multiple selection
    if (multiple && Array.isArray(value)) {
      const currentValues = selectedCountries.map((c) => c.alpha2);
      const hasChanges =
        value.length !== currentValues.length ||
        !value.every((v) => currentValues.includes(v));

      if (hasChanges) {
        const initialCountries = options.filter((country) =>
          value.includes(country.alpha2)
        );
        setSelectedCountries(initialCountries);
      }
    }
    // For single selection
    else if (!multiple && typeof value === "string") {
      const currentValue = selectedCountries[0]?.alpha2;
      if (value !== currentValue) {
        const initialCountry = options.find(
          (country) => country.alpha2 === value
        );
        setSelectedCountries(initialCountry ? [initialCountry] : []);
      }
    }
  }, [value, options, multiple]);

  const handleSelect = useCallback(
    (country) => {
      if (multiple) {
        const newSelection = selectedCountries.some(
          (c) => c.alpha2 === country.alpha2
        )
          ? selectedCountries.filter((c) => c.alpha2 !== country.alpha2)
          : [...selectedCountries, country];

        setSelectedCountries(newSelection);
        onChange?.(newSelection);
      } else {
        setSelectedCountries([country]);
        onChange?.(country);
        setOpen(false);
      }
    },
    [onChange, multiple, selectedCountries]
  );

  const triggerClasses = cn(
    "flex h-12 w-full items-center justify-between whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 ring-offset-background focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-colors duration-200",
    `text-${textSize}`,
    slim === true && "gap-1 w-min",
    inline && "rounded-r-none border-r-0 gap-1 pr-1 w-min",
    className
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={triggerClasses}
        disabled={disabled}
        {...props}
      >
        {selectedCountries.length > 0 ? (
          <div className="flex items-center flex-grow gap-2 overflow-hidden">
            {multiple ? (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedCountries.length} selected
              </span>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-4 h-4 shrink-0 overflow-hidden rounded-full">
                  <CircleFlag
                    countryCode={selectedCountries[0].alpha2.toLowerCase()}
                    height={16}
                  />
                </div>
                {slim === false && !inline && (
                  <span
                    className={`overflow-hidden text-ellipsis whitespace-nowrap text-black text-${textSize}`}
                  >
                    {selectedCountries[0].name}
                  </span>
                )}
              </>
            )}
          </div>
        ) : (
          <span
            className={`flex items-center gap-2 text-gray-400 text-${textSize}`}
          >
            {inline || slim ? <Globe size={16} /> : placeholder}
          </span>
        )}

        {!inline ? (
          <ChevronDown size={16} className="text-black opacity-50" />
        ) : (
          <ChevronsUpDown size={16} className="text-black opacity-50" />
        )}
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[--radix-popper-anchor-width] p-0"
      >
        <Command className="w-full max-h-[200px] sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput
                placeholder="Search country..."
                className={`h-12 text-${textSize} placeholder:text-gray-400 focus:placeholder:text-gray-400`}
              />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.name)
                .map((option, key) => (
                  <CommandItem
                    className={`flex items-center w-full gap-2 py-2.5 text-${textSize}`}
                    key={key}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="flex flex-grow space-x-2 overflow-hidden">
                      <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                        <CircleFlag
                          countryCode={option.alpha2.toLowerCase()}
                          height={20}
                        />
                      </div>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {option.name}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0",
                        selectedCountries.some(
                          (c) => c.alpha2 === option.alpha2
                        )
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent);
