import { useQuery} from "@tanstack/react-query";
import { Movie } from "../api/movie.ts";
import type {MediaType, MovieCartType, timeWindow} from "../share/types/MovieCart.ts"


export function useTrending(mediaType: MediaType, timeWindow: timeWindow){
    return useQuery({
        queryKey: ['trending', mediaType, timeWindow],
        queryFn: ()=> Movie(mediaType ,timeWindow),
        select: (data: MovieCartType[]) => data ?? [],
    })
}


