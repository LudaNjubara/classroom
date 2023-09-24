import { TCountry } from "@/types/typings";

const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all';

const fetchCountries = async () => {
    let countries: TCountry[] = [];
    let isLoading: boolean = true;
    let error: string | null = null;

    try {
        const response = await fetch(COUNTRIES_API_URL);
        const data = await response.json();
        countries = data;
        isLoading = false;
    }
    catch (error) {
        isLoading = false;
        error = (error as Error).message;
    }

    return { countries, isLoading, error };
};

export default fetchCountries;