import {Movie} from "../../api/movie.ts";
import {useEffect, useState} from "react";
import MovieCart from "../../components/MovieCart/MovieCart.tsx";


export default function HomePage() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        Movie().then(movies => setMovies(movies));
    }, []);

    return (

        <div className="movie-list">
            {movies.map(movie => <MovieCart data={movie}/>)}
        </div>
    )
}