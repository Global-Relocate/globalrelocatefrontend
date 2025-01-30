import React, { useCallback, useState, forwardRef, useEffect } from "react";

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

// CircleFlag
import { CircleFlag } from "react-circle-flags";

const languageMap = {
  eng: { name: "English", country: "US" },
  fra: { name: "French", country: "FR" },
  spa: { name: "Spanish", country: "ES" },
  deu: { name: "German", country: "DE" },
  ita: { name: "Italian", country: "IT" },
  por: { name: "Portuguese", country: "PT" },
  rus: { name: "Russian", country: "RU" },
  jpn: { name: "Japanese", country: "JP" },
  kor: { name: "Korean", country: "KR" },
  zho: { name: "Chinese", country: "CN" },
  ara: { name: "Arabic", country: "SA" },
  hin: { name: "Hindi", country: "IN" },
  ben: { name: "Bengali", country: "BD" },
  tur: { name: "Turkish", country: "TR" },
  vie: { name: "Vietnamese", country: "VN" },
  tha: { name: "Thai", country: "TH" },
  nld: { name: "Dutch", country: "NL" },
  pol: { name: "Polish", country: "PL" },
  ukr: { name: "Ukrainian", country: "UA" },
  swe: { name: "Swedish", country: "SE" },
  dan: { name: "Danish", country: "DK" },
  fin: { name: "Finnish", country: "FI" },
  nor: { name: "Norwegian", country: "NO" },
  ces: { name: "Czech", country: "CZ" },
  ron: { name: "Romanian", country: "RO" },
  hun: { name: "Hungarian", country: "HU" },
  ind: { name: "Indonesian", country: "ID" },
  msa: { name: "Malay", country: "MY" },
  fil: { name: "Filipino", country: "PH" },
};

// Create a list of unique languages
const uniqueLanguages = Object.entries(languageMap).map(([code, data]) => ({
  code,
  name: data.name,
  country: data.country
}));

const LanguageDropdownComponent = forwardRef(
  ({
    onChange,
    value,
    disabled = false,
    placeholder = "Select language",
    slim = false,
    inline = false,
    multiple = false,
    className,
    height = "h-10",
    ...props
  }, ref) => {
    const [open, setOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
      if (value) {
        // First try to find by country code
        let language = uniqueLanguages.find(lang => lang.country === value);
        // If not found, try to find by language code
        if (!language) {
          language = uniqueLanguages.find(lang => lang.code === value);
        }
        if (language) {
          setSelectedLanguage(language);
        }
      } else {
        setSelectedLanguage(null);
      }
    }, [value]);

    const handleSelect = useCallback(
      (language) => {
        setSelectedLanguage(language);
        // Pass both the language code and the full language object
        onChange?.({ code: language.code, name: language.name, country: language.country });
        setOpen(false);
      },
      [onChange]
    );

    const filteredLanguages = uniqueLanguages.filter(language =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const triggerClasses = cn(
      `flex ${height} w-full items-center justify-between whitespace-nowrap rounded-lg border border-input bg-transparent px-3 text-base ring-offset-background focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-colors duration-200`,
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
          {selectedLanguage ? (
            <div className="flex items-center flex-grow gap-2 overflow-hidden">
              <div className="inline-flex items-center justify-center w-4 h-4 shrink-0 overflow-hidden rounded-full">
                <CircleFlag
                  countryCode={selectedLanguage.country.toLowerCase()}
                  height={16}
                />
              </div>
              {slim === false && !inline && (
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-900 text-base">
                  {selectedLanguage.name}
                </span>
              )}
            </div>
          ) : (
            <span className="flex items-center gap-2 text-gray-400 text-base">
              {inline || slim ? <Globe size={16} /> : placeholder}
            </span>
          )}

          {!inline ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronsUpDown size={16} className="text-gray-400" />
          )}
        </PopoverTrigger>
        <PopoverContent
          collisionPadding={10}
          side="bottom"
          className="min-w-[--radix-popper-anchor-width] p-0"
        >
          <Command className="w-full max-h-[200px] sm:max-h-[270px] overflow-y-auto">
            <CommandList>
              <div className="sticky top-0 z-10 bg-popover">
                <CommandInput 
                  placeholder="Search language..." 
                  onValueChange={setSearchQuery}
                  value={searchQuery}
                  className="h-10 text-base placeholder:text-gray-400 focus:placeholder:text-gray-400"
                />
              </div>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {filteredLanguages.map((language) => (
                  <CommandItem
                    key={language.code}
                    className="flex items-center w-full gap-2 py-2.5 text-base cursor-pointer"
                    onSelect={() => handleSelect(language)}
                  >
                    <div className="flex flex-grow space-x-2 overflow-hidden">
                      <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                        <CircleFlag
                          countryCode={language.country.toLowerCase()}
                          height={20}
                        />
                      </div>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {language.name}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0",
                        selectedLanguage?.code === language.code
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
  }
);

LanguageDropdownComponent.displayName = "LanguageDropdownComponent";

export const LanguageDropdown = LanguageDropdownComponent; 
