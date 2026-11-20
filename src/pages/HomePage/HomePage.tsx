import TrendingSection from "../../components/TrendingSection/TrendingSection.tsx";
import AllMovies from "../../components/AllMovies/AllMovies.tsx";

export default function HomePage() {




    return (
        <div>
            <TrendingSection  mediaType='movie'/>
            <TrendingSection  mediaType='tv'/>
            <AllMovies mediaType='movie'/>
            <AllMovies mediaType='tv'/>
        </div>
    )
}