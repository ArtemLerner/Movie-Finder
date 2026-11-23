import {type MediaType} from "../../api/movie.ts";
import type {timeWindow} from "../../api/movie.ts";
import { useState} from "react";
import MovieCart from "../../components/MovieCart/MovieCart.tsx";
import MovieSwitchers from "../../components/MovieSwitchers/MovieSwitchers.tsx";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";
import Loading from "../Loading/Loading.tsx";
import {useTrending} from "../../hooks/useTrending.ts";

interface Props {
    mediaType: MediaType;
}

const buttonsTrending = [
    'day',
    'week'
]

export default function TrendingSection({ mediaType }: Props) {
    const [timeWindow, setTimeWindow] = useState<timeWindow>('day')
    const { data: movies = [], isLoading, isError} = useTrending(mediaType,timeWindow)



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
                isLoading
                    ?
                    <Loading/>
                    :
                    isError ? <p>Error</p> :
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
                        >
                            {movies.map(movie => (
                                <SwiperSlide key={movie.id}>
                                    <MovieCart  data={movie} />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    </div>
            }
        </div>

    )
}