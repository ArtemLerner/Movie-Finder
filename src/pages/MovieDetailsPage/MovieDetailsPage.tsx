import {useParams} from "react-router-dom";
import MovieDetails from "../../components/MovieDetails/MovieDetails.tsx";


export default function MovieDetailsPage(){
    const { type, id } = useParams<{ type: string; id: string }>();

    if (!type || !id) return <p>Неверный адрес</p>;

    return(
        <MovieDetails type={type} data={id}/>
    )
}