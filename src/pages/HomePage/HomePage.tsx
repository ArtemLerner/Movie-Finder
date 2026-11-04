import TrendingSection from "../../components/TrendingSection/TrendingSection.tsx";

export default function HomePage() {




    return (
        <div>
            <TrendingSection  mediaType='movie'/>
            <TrendingSection  mediaType='tv'/>
        </div>
    )
}