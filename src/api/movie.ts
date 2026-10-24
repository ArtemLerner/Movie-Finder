
const TMDB_TOKENT = import.meta.env.VITE_TMDB_TOKENT;
const BASE_URL: string = 'https://api.themoviedb.org/3/';
export async function Movie(){

    try{
        const response = await fetch(
            'https://api.themoviedb.org/3/trending/all/day?language=en-US', {
                headers: { Authorization: `Bearer ${TMDB_TOKENT}` },
            });
        const data = await response.json();

        return data.results;
    }catch (error){
        console.error(error);
    }
}