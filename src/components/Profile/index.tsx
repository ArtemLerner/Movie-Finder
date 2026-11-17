import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Loading from "../Loading/Loading.tsx";

export default function Profile() {
    const {user, setUser} = useAuth();
    const nav = useNavigate();

    const [loading, setLoading] = useState(false);

    const data: string[] = [''];

    const VITE_URL = import.meta.env.VITE_URL;

    useEffect(() => {
        if(!user) nav('/register');
    });

    const userImg = '../../../public/profile.svg';

    async function handleLogOut(){
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

    return (
        <main className="profile">
            {
                loading ? <Loading/> :
                    <>
                        <section className="profile__header">
                            <img className="profile__avatar" src={userImg} alt="User avatar"/>
                            <div className="profile__info">
                                <h1 className="profile__name">{user?.email}</h1>
                                <p className="profile__email">artem@example.com</p>
                            </div>

                            <button className="profile__logout" type="button" onClick={handleLogOut}>
                                Log out
                            </button>
                        </section>

                        <section className="profile__favorites">
                            <h2>Favorite movies</h2>
                            {data.length === 0 ?
                            <ul className="movie-list">
                                {/*<MovieCart data={}/>*/}
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