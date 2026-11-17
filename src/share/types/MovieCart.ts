export type MovieCartType = {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    media_type?: "movie" | "tv";

}

export type MovieDetailsType = MovieCartType & {
    backdrop_path?: string | null;
    tagline?: string;
    overview?: string;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
    runtime?: number;
    genres?: { id: number; name: string }[];
};

