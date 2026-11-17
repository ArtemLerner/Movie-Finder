import type {MovieCartType} from "../../share/types/MovieCart.ts";
import {Link} from "react-router-dom";
import type SwiperType from "swiper";

type PropsMovie = {
    data: MovieCartType;
    swiper?: SwiperType | null;
}
const IMG = 'https://image.tmdb.org/t/p/w342';


export default function MovieCart({data, swiper}: PropsMovie) {
    const title = data.name ? data.name : data.title

    return (
        <div className="movie-block" key={data.id}>
                <Link
                    to={`/${data.media_type}/${data.id}`}
                    rel="noreferrer"
                >
                <p>{title}</p>
                {data.poster_path ?
                    <img src={IMG + data.poster_path} alt={title} loading="lazy" decoding="async"
                         onLoad={() => swiper?.update()}
                    />
                    :
                    <div className="no-poster">Нет постера</div>}
            </Link>
        </div>
    )
}