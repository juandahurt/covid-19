import config from '../config';

export async function getSummary() {
    return (await fetch(`${config.covidBaseURL}/summary`)).json();
}
