import type {MovieCartType} from "../../share/types/MovieCart.ts";
import {Link} from "react-router-dom";

type PropsMovie = {
    data: MovieCartType;
}
const IMG = 'https://image.tmdb.org/t/p/w342';


export default function MovieCart({data}: PropsMovie) {
    const title = data.name ? data.name : data.title

    return (
        <div className="movie-block" key={data.id}>
                <Link
                    to={`https://uakinogo.io/search/${encodeURIComponent(title ? title: '')}`}
                    target="_blank"
                    rel="noreferrer"
                >
                <p>{title}</p>
                {data.poster_path ?
                    <img src={IMG + data.poster_path} alt={title} loading="lazy" decoding="async"/>
                    :
                    <div className="no-poster">Нет постера</div>}
            </Link>
        </div>
    )
}