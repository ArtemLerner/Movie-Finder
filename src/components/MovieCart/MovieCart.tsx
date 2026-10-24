import type {MovieCart} from "../../share/types/MovieCart.ts";

type PropsMovie = {
    data: MovieCart[];
}
const IMG = 'https://image.tmdb.org/t/p/w500';
export default function MovieCart({data}: PropsMovie) {
    return (
        <div className="movie-block">
            <p>{data.name ? data.name: data.title}</p>
            <img src={IMG + data.poster_path} alt={data.title} />
        </div>
    )


}