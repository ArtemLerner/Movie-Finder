import type {MovieCartType} from "../../share/types/MovieCart.ts";

type PropsMovie = {
    data: MovieCartType;
}
const IMG = 'https://image.tmdb.org/t/p/w500';

export default function MovieCart({data}: PropsMovie) {
    return (
        <div className="movie-block" key={data.id}>
            <p>{data.name ? data.name: data.title}</p>
            <img src={IMG + data.poster_path} alt={data.title} />
        </div>
    )


}