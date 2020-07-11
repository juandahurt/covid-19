import config from '../config';

export async function getSummary() {
    return (await fetch(`${config.covidBaseURL}summary`)).json();
}

export async function getAllByCountry(country) {
    return (await fetch(`${config.covidBaseURL}total/country/${country}`)).json();
}
