import MovieCart from "../../components/MovieCart/MovieCart.tsx";
import {useEffect, useState} from "react";
import type {MovieCartType} from "../../share/types/MovieCart.ts";
import {SearchMovies} from "../../api/movie.ts";
import "swiper/css";
import "swiper/css/navigation";
import { useSearchParams } from "react-router-dom";

export default function SearchPage(){
    const [results, setResults] = useState<MovieCartType[]>([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";


    useEffect(() => {

        SearchMovies(query)
            .then(movies => setResults(movies ?? []));
    }, [query]);
    return (
        <>
            <div className='movie-cart'>
                {results.map(movie =>
                    <MovieCart key={movie.id} data={movie}/>
                )}
            </div>
        </>
    )
}