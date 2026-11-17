import {useState, useEffect} from "react";
import type { MovieDetailsType} from "../../share/types/MovieCart.ts";
import '../MovieDetails/profile-module.css'
import Loading from "../Loading/Loading.tsx";

type Props = {
    type: string | undefined;
    data: string | undefined;
}
const URL = import.meta.env.VITE_URL;

export default  function MovieDetails({type, data}: Props){
    const [loading, setLoading] = useState<boolean>(true);
    const [movie, setMovie] = useState<MovieDetailsType | null>(null);


    useEffect(() => {
        if (!type || !data) return;

        async function loadMovies(){
            try{
                const res = await fetch(`${URL}/api/${type}/${data}`,{
                    credentials: "include",
                }).finally(()=>setLoading(false));

                const dataRes = await res.json();

                console.log(dataRes);
                setMovie(dataRes.results)

            }catch(err){
                console.log("error fetch node", err);
            }
        }

        void loadMovies();


    }, [type, data])

    if (loading) return (
        <Loading/>
    )
    if (!movie) return null;

    return (
        <div className="movie">
            <div
                className="movie__backdrop"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}
            />

            <div className="movie__content">
                <img
                    className="movie__poster"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title ?? movie.name}
                />

                <div className="movie__info">
                    <h1 className="movie__title">{movie.title ?? movie.name}</h1>
                    <p className="movie__tagline">{movie.tagline}</p>

                    <div className="movie__meta">
                        <span className="movie__rating">{movie.vote_average?.toFixed(1)}</span>
                        <span>{(movie.release_date ?? movie.first_air_date)?.slice(0, 4)}</span>
                        <span>{movie.runtime} мин</span>
                    </div>

                    <ul className="movie__genres">
                        {movie.genres?.map((g) => (
                            <li key={g.id}>{g.name}</li>
                        ))}
                    </ul>

                    <p className="movie__overview">{movie.overview}</p>

                    <div className="movie__actions">
                        <button className="movie__btn movie__btn--primary">Смотреть</button>
                        <button className="movie__btn">В избранное</button>
                    </div>
                </div>
            </div>
        </div>
    );
}