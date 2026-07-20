// import countries from "world-countries";

// export type CountryOption = {
//   value: string;   // ISO code (PK, US, GB)
//   label: string;   // Country name
//   flag: string;    // emoji or code if needed
// };

// export const getCountries = (): CountryOption[] => {
//   return countries.map((country) => ({
//     value: country.cca2,
//     label: country.name.common,
//     flag: country.flag,
//   }));
// };




import countries from "world-countries";

export type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

// Convert ISO code → emoji flag
function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export const getCountries = (): CountryOption[] => {
  return countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flag: getFlagEmoji(country.cca2),
  }));
};

// console.log(getCountries().find(c => c.value === "PK"));