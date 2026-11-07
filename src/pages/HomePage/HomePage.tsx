import TrendingSection from "../../components/TrendingSection/TrendingSection.tsx";
import MovieFinder from "../../components/MovieFinder/MovieFinder.tsx";

export default function HomePage() {




    return (
        <div>
            <MovieFinder/>
            <TrendingSection  mediaType='movie'/>
            <TrendingSection  mediaType='tv'/>
        </div>
    )
}