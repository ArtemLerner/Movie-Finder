import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function Profile() {
    const {user, setUser} = useAuth();
    const nav = useNavigate();

    useEffect(() => {
        if (!user) nav('/register');
    })
    const userImg = '../../../public/profile.svg';
    console.log(user);

    async function handleLogOut(){
        try{
            await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include",
            })
        } finally {
            setUser(null);
            nav('/');
        }
    }

    return (
        <main className="profile">
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

                <ul className="movie-list">
                    <li className="movie-card">
                        <img src="poster.jpg" alt="Movie poster"/>
                        <h3>Fight Club</h3>
                        <p>1999 · ⭐ 8.4</p>
                        <button type="button">Remove</button>
                    </li>

                    <li className="movie-card">
                        <img src="poster2.jpg" alt="Movie poster"/>
                        <h3>Inception</h3>
                        <p>2010 · ⭐ 8.8</p>
                        <button type="button">Remove</button>
                    </li>
                </ul>

                <p className="profile__empty">You have no favorite movies yet.</p>
            </section>
        </main>
    )
}