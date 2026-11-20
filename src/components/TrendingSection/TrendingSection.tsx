import {type MediaType, Movie} from "../../api/movie.ts";
import type {timeWindow} from "../../api/movie.ts";
import {useEffect, useState} from "react";
import MovieCart from "../../components/MovieCart/MovieCart.tsx";
import MovieSwitchers from "../../components/MovieSwitchers/MovieSwitchers.tsx";
import type {MovieCartType} from "../../share/types/MovieCart.ts";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Loading from "../Loading/Loading.tsx";
import type SwiperType from "swiper"

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
    const [loading, setLoading] = useState<boolean>(true);

    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

    useEffect(() => {
        Movie(mediaType, timeWindow)
            .then(movies => setMovies(movies ?? []))
            .finally(() => setLoading(false));
    }, [mediaType, timeWindow]);


    return (
        <div className='trending'>
            <div className="trending__header">

                <h2>Trending {`${mediaType}`}</h2>
                <MovieSwitchers
                    buttons={buttonsTrending}
                    time={setTimeWindow}
                />
            </div>
            {
                loading
                    ?
                    <Loading/>
                    :
                    <div className="movie-list">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            loop={movies.length > 8}
                            loopAdditionalSlides={6}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            navigation
                            spaceBetween={16}
                            slidesPerView="auto"
                            onSwiper={setSwiperInstance}
                        >
                            {movies.map(movie => (
                                <SwiperSlide key={movie.id}>
                                    <MovieCart swiper={swiperInstance} data={movie} />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    </div>
            }
        </div>

    )
}