import MovieCart from "../../components/MovieCart/MovieCart.tsx";
import {useEffect, useState} from "react";
import type {MovieCartType} from "../../share/types/MovieCart.ts";
import {SearchMovies} from "../../api/movie.ts";
import "swiper/css";
import "swiper/css/navigation";
import {useNavigate, useSearchParams} from "react-router-dom";
import Loading from "../../components/Loading/Loading.tsx";

export default function SearchPage(){
    const [results, setResults] = useState<MovieCartType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";

    const nav = useNavigate();



    useEffect(() => {
        SearchMovies(query)
            .then(movies => setResults(movies ?? []))
            .finally(() => setLoading(false))
        if(query === ''){
            nav('/');
        }
    }, [query]);
    return (
        <>
            {
                loading ? <Loading/>
                    :
                    <div className='movie-cart'>
                        {results.map(movie =>
                            <MovieCart key={movie.id} data={movie}/>
                        )}
                    </div>
            }
        </>
    )
}