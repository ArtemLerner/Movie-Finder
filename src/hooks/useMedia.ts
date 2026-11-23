import { useQuery} from "@tanstack/react-query";
import {AllMoviesApi} from "../api/movie.ts";
import type {MediaType, MovieCartType} from "../share/types/MovieCart.ts"


export function useMedia(mediaType: MediaType){
    return useQuery({
        queryKey: ['trending', mediaType],
        queryFn: ()=> AllMoviesApi(mediaType),
        select: (data: MovieCartType[]) => data ?? [],
    })
}


