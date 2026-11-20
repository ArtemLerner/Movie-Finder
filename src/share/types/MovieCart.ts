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
export type MediaType = 'movie' | 'tv';

export type FavoriteRef = { id: number; media_type: MediaType };

export const isMediaType = (v: string | undefined): v is MediaType =>
    v === 'movie' || v === 'tv';