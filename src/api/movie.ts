
const TMDB_TOKENT = import.meta.env.VITE_TMDB_TOKENT;
const BASE_URL: string = 'https://api.themoviedb.org/3/';

export type timeWindow = 'day' | 'week';
export type MediaType = 'movie' | 'tv';


export async function Movie(mediaType: MediaType, timeWindow: timeWindow){

    try{
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?language=en-US`, {
                headers: { Authorization: `Bearer ${TMDB_TOKENT}` },
            });
        const data = await response.json();

        return data.results;
    }catch (error){
        console.error(error);
    }
}