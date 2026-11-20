import {AllMoviesApi, type MediaType} from "../../api/movie.ts";
import {useEffect, useState} from "react";
import MovieCart from "../../components/MovieCart/MovieCart.tsx";
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

export default function AllMovies({mediaType}: Props) {
    const [movies, setMovies] = useState<MovieCartType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

    useEffect(() => {
        AllMoviesApi(mediaType)
            .then(movies => setMovies(movies ?? []))
            .finally(() => setLoading(false));
    },[mediaType]);

    return (
        <div className='trending'>
            <div className="trending__header">
                <h2>All {mediaType}</h2>
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