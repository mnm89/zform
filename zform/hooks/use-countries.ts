import { CountryCode } from "libphonenumber-js";
import wordCountries from "world-countries";

const countries = wordCountries
  .sort((a, b) => a.cca3.localeCompare(b.cca3))
  .map(({ cca2, flag, idd: { root, suffixes }, name }) => ({
    countryCode: cca2 as CountryCode,
    countryName: name.common,
    countryCallingCode:
      suffixes && suffixes.length > 0 ? `${root}${suffixes[0]}` : root,
    flag: `https://flagcdn.com/w40/${cca2.toLowerCase()}.png`,
    emoji: flag,
  }));
function getCountryFlagUrl(code: CountryCode) {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}
function getCountryFlagEmoji(code: CountryCode) {
  return wordCountries.find((wc) => wc.cca2 === code)?.flag;
}
function getCountry(code: CountryCode) {
  return countries.find((c) => c.countryCode === code);
}
function getCountryCallingCode(code: CountryCode) {
  const country = wordCountries.find((wc) => wc.cca2 === code);
  if (country) {
    const {
      idd: { root, suffixes },
    } = country;

    return suffixes && suffixes.length > 0 ? `${root}${suffixes[0]}` : root;
  }
  return "";
}
export const useCountries = () => {
  return {
    countries,
    getCountryFlagEmoji,
    getCountryFlagUrl,
    getCountry,
    getCountryCallingCode,
  };
};
