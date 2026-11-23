import {useQuery} from "@tanstack/react-query";
import {getAllFavorites} from "../api/movie.ts"
import type {MovieCartType} from "../share/types/MovieCart.ts";

export function useFavorites(){
    return useQuery({
        queryKey: ['Favorites'],
        queryFn: () => getAllFavorites(),
        select: (data: MovieCartType[]) => data ?? [],
        staleTime: 60_000,
    })
}