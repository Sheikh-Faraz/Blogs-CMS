// "use client";

// import * as React from "react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import ReactCountryFlag from "react-country-flag";

// import { IoMdGlobe as Globe } from "react-icons/io";
// import { FaAngleDown as ArrowDown } from "react-icons/fa";
// import { CiSearch as SearchIcon } from "react-icons/ci";



// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
// //   DropdownMenuLabel,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/dropdown-menu";

// import { getCountries } from "@/lib/countries";

// // interface Props {
// //   onChange?: (value: string) => void;
// // }

// interface Props {
//   value?: string;
//   onChange?: (value: string) => void;
// }

// export default function CountrySelect({ value, onChange }: Props) {
//   const countries = React.useMemo(() => getCountries(), []);

//   const [search, setSearch] = React.useState("");

//   // const [selectedCountry, setSelectedCountry] = React.useState<
//   //   (typeof countries)[number] | null
//   // >(null);

//   const [selectedCountry, setSelectedCountry] = React.useState<(typeof countries)[number] | null>(null);

//   React.useEffect(() => {
//     if (!value) {
//       setSelectedCountry(null);
//       return;
//     }

//     const country =
//       countries.find((c) => c.label === value) ||
//       countries.find((c) => c.value === value);

//     setSelectedCountry(country ?? null);
//   }, [value, countries]);



//   const filteredCountries = React.useMemo(() => {
//     return countries.filter((country) =>
//       country.label.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [countries, search]);

//   return (
//     <DropdownMenu
//       onOpenChange={(open) => {
//         if (!open) {
//           setSearch("");
//         }
//       }}
//     >
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" className="w-full justify-between">
//           {selectedCountry ? (
//             <span className="flex items-center gap-2">

//                 <ReactCountryFlag
//                 countryCode={selectedCountry.value}
//                 svg
//                 style={{
//                     width: "1.2em",
//                     height: "1.2em",
//                 }}
//                 />

//               <span>{selectedCountry.label}</span>
//                 <ArrowDown />
//             </span>
//           ) : (
//             <div className="flex items-center gap-2 justify-between w-full">
//                 <span className="flex gap-2 items-center">
//                     <Globe />
//                     Select Country
//                 </span>
//                 <ArrowDown />
//             </div>
//           )}
//         </Button>
//       </DropdownMenuTrigger>

// <DropdownMenuContent
//   align="start"
//   className="w-[300px] p-0"
// >
//   {/* Fixed Search */}
//   <div className="sticky flex items-center top-0 z-10 bg-background border-b py-4 px-2">
//     <Input
//       placeholder="Search country..."
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//     />
//     <SearchIcon className="h-4 w-4 text-muted-foreground" />
//   </div>

//   {/* Scrollable List */}
//   <div className="h-64 overflow-y-auto">
//     <DropdownMenuGroup>
//       {filteredCountries.map((country) => (
//         <DropdownMenuCheckboxItem
//           key={country.value}
//           checked={selectedCountry?.value === country.value}
//           // onCheckedChange={() => {
//           //   setSelectedCountry(country);
//           //   onChange?.(country.value);
//           // }}
//           onCheckedChange={() => {
//             setSelectedCountry(country);
//             onChange?.(country.label);
//           }}
//         >
//           <span className="flex items-center gap-2">

//             <ReactCountryFlag
//                 countryCode={country.value}
//                 svg
//                 style={{
//                     width: "1.2em",
//                     height: "1.2em",
//                 }}
//                 />

//             <span>{country.label}</span>
//           </span>
//         </DropdownMenuCheckboxItem>
//       ))}

//       {filteredCountries.length === 0 && (
//         <div className="p-2 text-sm text-muted-foreground">
//           No country found.
//         </div>
//       )}
//     </DropdownMenuGroup>
//   </div>
// </DropdownMenuContent>


//     </DropdownMenu>
//   );
// }






"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

import { Button } from "@/components/ui/button";
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

import { cn } from "@/lib/utils";
import { getCountries } from "@/lib/countries";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export default function CountrySelect({
  value,
  onChange,
}: Props) {
  const countries = React.useMemo(() => getCountries(), []);

  const [open, setOpen] = React.useState(false);

  const selectedCountry = React.useMemo(
    () =>
      countries.find(
        (country) =>
          country.label === value ||
          country.value === value
      ) ?? null,
    [countries, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={selectedCountry.value}
                svg
                style={{
                  width: "1.2em",
                  height: "1.2em",
                }}
              />

              <span>{selectedCountry.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              Select country...
            </span>
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[320px] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search country..." />

          <CommandList className="max-h-72">
            <CommandEmpty>
              No country found.
            </CommandEmpty>

            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => {
                    onChange?.(country.label);
                    setOpen(false);
                  }}
                >
                  <ReactCountryFlag
                    countryCode={country.value}
                    svg
                    style={{
                      width: "1.1em",
                      height: "1.1em",
                    }}
                  />

                  <span className="ml-2 flex-1">
                    {country.label}
                  </span>

                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedCountry?.value === country.value
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





