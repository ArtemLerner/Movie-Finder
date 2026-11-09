const BASE = 'https://api.themoviedb.org/3/';
const TMDB_TOKENT = process.env.VITE_TMDB_TOKENT;
export async function Movie(mediaType, timeWindow) {
    try {
        const response = await fetch(`${BASE}trending/${mediaType}/${timeWindow}?language=en-US`, {
            headers: { Authorization: `Bearer ${TMDB_TOKENT}` },
        });
        const data = await response.json();
        console.log(data);
        return data.results;
    }
    catch (error) {
        console.error(error);
    }
}
export async function SearchMovies(query) {
    try {
        const res = await fetch(`${BASE}search/multi?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${TMDB_TOKENT}` },
        });
        const data = await res.json();
        return data.results;
    }
    catch (error) {
        console.error(error);
    }
}
