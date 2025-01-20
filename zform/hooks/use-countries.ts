import wordCountries from "world-countries";

export const useCountries = () => {
  const countries = wordCountries
    .sort((a, b) => a.cca3.localeCompare(b.cca3))
    .map(({ cca2, flag, name }) => ({
      countryCode: cca2,
      countryName: name.common,
      flag: `https://flagcdn.com/w40/${cca2.toLowerCase()}.png`,
      emoji: flag,
    }));
  function getCountryFlagUrl(code: string) {
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  }
  function getCountryFlagEmoji(code: string) {
    return wordCountries.find((wc) => wc.cca2 === code)?.flag;
  }
  function getCountry(code: string) {
    return countries.find((c) => c.countryCode === code);
  }
  function getCountryName(code: string) {
    return countries.find((c) => c.countryCode === code)?.countryName;
  }
  return {
    countries,
    getCountryFlagEmoji,
    getCountryFlagUrl,
    getCountry,
    getCountryName,
  };
};
