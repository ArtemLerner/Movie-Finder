import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Loading from "../Loading/Loading.tsx";
import MovieCart from "../MovieCart/MovieCart.tsx";
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import type SwiperType from "swiper";

export default function Profile() {
    const {user, setUser} = useAuth();
    const nav = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

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
    useEffect(()=>{
        if(!user) return;
        const email = user?.email

        async function handleLogout(){
            try{
                setLoading(true);
                const res = await fetch(`${VITE_URL}/api/get-favorite`,{
                    method: "POST",
                    credentials: "include",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email})
                })
                const data = await res.json();

                setFavorites(data.movies);
                setLoading(false);

            }catch (error) {
            }

        }
        handleLogout();
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
                                <p className="profile__email">artem@example.com</p>
                            </div>

                            <button className="profile__logout" type="button" onClick={handleLogOut}>
                                Log out
                            </button>
                        </section>

                        <section className="profile__favorites">
                            <h2>Favorite movies</h2>
                            {favorites ?
                            <ul className="movie-list">
                                <Swiper
                                    modules={[Navigation]}
                                    navigation
                                    spaceBetween={16}
                                    freeMode
                                    slidesPerView="auto"
                                    onSwiper={setSwiperInstance}
                                    breakpoints={{
                                        390: { slidesPerView: 2 },
                                        768: { slidesPerView: 4 },
                                        1200: { slidesPerView: 6 },
                                    }}
                                >
                                    {favorites.map(movie =>
                                        <SwiperSlide key={movie.id}>
                                            <MovieCart key={movie.id} swiper={swiperInstance} data={movie}/>
                                        </SwiperSlide>
                                    )}
                                </Swiper>
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