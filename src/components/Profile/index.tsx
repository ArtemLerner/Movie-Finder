import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Loading from "../Loading/Loading.tsx";
import MovieCart from "../MovieCart/MovieCart.tsx";
import type {MovieDetailsType} from "../../share/types/MovieCart.ts";

export default function Profile() {
    const {user, setUser} = useAuth();
    const nav = useNavigate();

    const [favorites, setFavorites] = useState<MovieDetailsType[]>([]);

    const [loading, setLoading] = useState(false);


    const VITE_URL = import.meta.env.VITE_URL;

    useEffect(() => {
        if(!user) nav('/register');
    });

    const userImg = '/profile.svg';

    async function handleLogOut(){
        if(!user) return;

        try{
            setLoading(true);
            await fetch(`${VITE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            })
        } finally {
            setUser(null);
            nav('/register');
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!user) return;

        async function handleLogout(){
            if(!user) return;

            try{
                setLoading(true);
                const res = await fetch(`${VITE_URL}/api/favorites`,{
                    credentials: "include",
                })
                const data = await res.json();

                if(res.ok){
                    setFavorites(data.movies);
                    setLoading(false);
                }else{
                    console.log(data.error);
                }
            }catch (error) {
                console.log(error);
            }

        }
        void handleLogout();
    },[user])

    return (
        <main className="profile">
            {
                loading ? <Loading/> :
                    <>
                        <section className="profile__header">
                            <img className="profile__avatar" src={userImg} alt="User avatar"/>
                            <div className="profile__info">
                                <h1 className="profile__name">{user?.email}</h1>
                            </div>

                            <button className="profile__logout" type="button" onClick={handleLogOut}>
                                Log out
                            </button>
                        </section>

                        <section className="profile__favorites">
                            <h2>Favorite movies</h2>
                            {favorites  ?
                                <ul className="movie-list " >
                                <div className="movies-grid">
                                    {favorites.map(movie =>
                                        <MovieCart key={movie.id} data={movie}/>
                                    )}
                                </div>
                                </ul>

                                :
                            <p className="profile__empty">You have no favorite movies yet.</p>
                            }
                        </section>
                </>
            }

        </main>
    )
}