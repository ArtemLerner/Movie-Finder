import {type MediaType} from "../../api/movie.ts";
import MovieCart from "../../components/MovieCart/MovieCart.tsx";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Loading from "../Loading/Loading.tsx";
import {useMedia} from "../../hooks/useMedia.ts";

interface Props {
    mediaType: MediaType;
}

export default function AllMovies({mediaType}: Props) {
    const { data: movies = [], isLoading, isError } = useMedia(mediaType)

    return (
        <div className='trending'>
            <div className="trending__header">
                <h2>All {mediaType}</h2>
            </div>
            {
                isLoading
                    ?
                    <Loading/>
                    :
                    isError ? <p>Eror</p> :
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
                                    <MovieCart data={movie} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
            }
        </div>
    )
}