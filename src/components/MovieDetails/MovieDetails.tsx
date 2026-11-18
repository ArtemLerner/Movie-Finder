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
    const [favorites, setFavorites] = useState<any[]>([]);
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



    }, [type, data, user])

    useEffect(()=>{
        console.log("effect run", user);

        async function getAllFavoriteMovies(){

            if(!user) return  console.log("No user found");

            const email = user?.email;
            try{
                const res = await fetch(`${URL}/api/get-favorite`,{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({email})
                })
                const dataRes = await res.json();


                if(res.ok){
                    console.log(dataRes.movies);
                    setFavorites(dataRes.movies)
                }else{
                    console.log(dataRes.error)
                }
            }catch (err){
                console.log(err);
            }
        }
        void getAllFavoriteMovies()

    },[user])
    const isFavorite = favorites.some(
        m => String(m.id) === data && m.media_type === type
    );


    if (loading) return (
        <Loading/>
    )
    if (!movie) return null;




 // TODO 1.get-favorit fetch -> nav check ? setFavorite(true) : false
 //      2.fix: find the token





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

            if (res.ok) {
                setFavorites(prev => [...prev, { id: Number(data), media_type: type }]);
            }

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

            setFavorites(prev =>
                prev.filter(m => !(String(m.id) === data && m.media_type === type))
            );
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
                            className={isFavorite ? "movie__btn__del" : "movie__btn"}
                            onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
                        >
                            {isFavorite ? 'Уже в избранном' : 'В избранное'}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}