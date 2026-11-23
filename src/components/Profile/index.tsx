import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Loading from "../Loading/Loading.tsx";
import MovieCart from "../MovieCart/MovieCart.tsx";
import {useFavorites} from "../../hooks/useFavorites.ts";

const userImg = '/profile.svg';
const VITE_URL = import.meta.env.VITE_URL;


export default function Profile() {
    const {user, setUser} = useAuth();
    const { data: favorites = [], isLoading  } = useFavorites();
    const nav = useNavigate();

    useEffect(() => {
        if(!user) nav('/register');
    });


    async function handleLogOut(){
        if(!user) return;

        try{
            await fetch(`${VITE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            })
        } finally {
            setUser(null);
            nav('/register');
        }
    }

    return (
        <main className="profile">
            {
                isLoading ? <Loading/> :
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