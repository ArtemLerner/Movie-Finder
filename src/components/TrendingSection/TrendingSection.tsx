import {type MediaType, Movie} from "../../api/movie.ts";
import type {timeWindow} from "../../api/movie.ts";
import {useEffect, useState} from "react";
import MovieCart from "../../components/MovieCart/MovieCart.tsx";
import MovieSwitchers from "../../components/MovieSwitchers/MovieSwitchers.tsx";
import type {MovieCartType} from "../../share/types/MovieCart.ts";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Props {
    mediaType: MediaType;
}

const buttonsTrending = [
    'day',
    'week'
]

export default function TrendingSection({ mediaType }: Props) {
    const [movies, setMovies] = useState<MovieCartType[]>([]);
    const [timeWindow, setTimeWindow] = useState<timeWindow>('day')

    useEffect(() => {
        Movie(mediaType, timeWindow).then(movies => setMovies(movies ?? []));
    }, [mediaType, timeWindow]);

    return (
        <div className='trending'>
            <div className="trending__header">
                <MovieSwitchers
                    buttons={buttonsTrending}
                    time={setTimeWindow}
                />
                <h2>Trending {`${mediaType}`}</h2>

            </div>

            <div className="movie-list">
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
                {movies.map(movie =>
                   <SwiperSlide key={movie.id}>
                       <MovieCart key={movie.poster_path} data={movie}/>
                   </SwiperSlide>
                )}
                </Swiper>
            </div>
        </div>

    )
}