import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage.tsx";
import SearchPage from "../pages/SearchPage/SearchPage.tsx";

export function Router() {

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/search" element={<SearchPage/>} />
            </Routes>
        </BrowserRouter>
    )

}