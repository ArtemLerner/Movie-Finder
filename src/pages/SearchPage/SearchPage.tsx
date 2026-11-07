import MovieFinder from "../../components/MovieFinder/MovieFinder.tsx";
import MovieCart from "../../components/MovieCart/MovieCart.tsx";
import {useEffect, useState} from "react";
import type {MovieCartType} from "../../share/types/MovieCart.ts";
import {SearchMovies} from "../../api/movie.ts";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
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
            <MovieFinder/>

            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={16}
                slidesPerView={6}
                breakpoints={{
                    768: { slidesPerView: 4 },
                    1200: { slidesPerView: 6 },
                }}
            >
                {results.map(movie =>
                    <SwiperSlide key={movie.id}>
                        <MovieCart key={movie.poster_path} data={movie}/>
                    </SwiperSlide>
                )}

            </Swiper>
        </>
    )
}