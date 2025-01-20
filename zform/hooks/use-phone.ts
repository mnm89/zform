import { CountryCode, AsYouType } from "libphonenumber-js";
import metadata from "libphonenumber-js/metadata.min.json";

export function usePhone() {
  const countries = Object.entries(metadata.countries).map(([k, value]) => ({
    countryCode: k as CountryCode,
    phoneCode: value[0] as string,
    iddPrefix: value[1] as string,
    nationalPattern: value[2] as string,
    possibleLengths: value[3] as string[],
    flag: `https://flagcdn.com/w40/${k.toLowerCase()}.png`,
  }));

  const typing = new AsYouType();

  return { countries, typing };
}