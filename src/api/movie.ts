const TMDB_TOKENT = import.meta.env.VITE_TMDB_TOKENT;
const BASE_URL: string =  import.meta.env.VITE_URL + '/api/';

export type timeWindow = 'day' | 'week';
export type MediaType = 'movie' | 'tv';


export async function Movie(mediaType: MediaType, timeWindow: timeWindow){

    try{
        const response = await fetch(
            `${BASE_URL}trending/${mediaType}/${timeWindow}?language=en-US`, {
                headers: { Authorization: `Bearer ${TMDB_TOKENT}` },
            });
        const data = await response.json();

        return data.results;
    }catch (error){
        console.error(error);
    }
}

export async function SearchMovies(query: string){

    const res = await fetch(
        `${BASE_URL}search?q=${encodeURIComponent(query)}`

        , {
            headers: { Authorization: `Bearer ${TMDB_TOKENT}` },
        });

    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return data.results;

}