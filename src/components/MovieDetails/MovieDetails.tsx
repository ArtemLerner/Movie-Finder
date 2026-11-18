import {useState, useEffect, type ButtonHTMLAttributes} from "react";
import type { MovieDetailsType} from "../../share/types/MovieCart.ts";
import '../MovieDetails/profile-module.css'
import Loading from "../Loading/Loading.tsx";
import {useAuth} from "../../context/AuthContext.tsx";

type Props = {
    type: string | undefined;
    data: string | undefined;
}
const URL = import.meta.env.VITE_URL;

export default  function MovieDetails({type, data}: Props){
    const [favoriteMovie, setFavorite] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true);
    const [movie, setMovie] = useState<MovieDetailsType | null>(null);
    const {user} = useAuth();

    useEffect(() => {
        if (!type || !data) return;

        async function loadMovies(){
            try{
                const res = await fetch(`${URL}/api/${type}/${data}`,{
                    credentials: "include",
                }).finally(()=>setLoading(false));

                const dataRes = await res.json();
                setMovie(dataRes.results)
            }catch(err){
                console.log(err);
            }
        }

        void loadMovies();


    }, [type, data])

    if (loading) return (
        <Loading/>
    )
    if (!movie) return null;


    async function handleAddFavorite(e: React.MouseEvent<HTMLButtonElement>){
        if(!user) return

        const email = user.email;
        try {
            const res = await fetch(`${URL}/api/favorite`,{
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({emailUser: email, type, id: data})
            })

            const dataRes = await res.json();
            setFavorite(false);

        }catch(err){
            console.log(err);
        }
    }

    async function handleRemoveFavorite(e: React.MouseEvent<HTMLButtonElement>){
        if(!user) return

        const email = user.email;
        try {
            const res = await fetch(`${URL}/api/favorite-del`,{
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({emailUser: email, type, id: data})
            })

            const dataRes = await res.json();
            setFavorite(true)

        }catch(err){
            console.log(err);
        }
    }



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

                        <button
                            className={favoriteMovie ? "movie__btn__del" : "movie__btn"}
                            onClick={favoriteMovie ? handleRemoveFavorite : handleAddFavorite}
                        >
                            {favoriteMovie ? 'Уже в избранном' : 'В избранное'}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}