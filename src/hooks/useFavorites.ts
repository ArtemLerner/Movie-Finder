import {useQuery} from "@tanstack/react-query";
import {getAllFavorites} from "../api/movie.ts"

export function useFavorites(){
    return useQuery({
        queryKey: ['Favorites'],
        queryFn: getAllFavorites,
        staleTime: 60_000,
    })
}