import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage.tsx";
import SearchPage from "../pages/SearchPage/SearchPage.tsx";
import {Header} from "../components/Header/Header.tsx";
import RegisterPage from "../pages/RegisterPage/RegisterPage.tsx";
import Profile from "../pages/ProfilePage";
import {ProtectedRouter, GuestRouter} from "../context/AuthRouter.tsx";


export function Router() {

    return(
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/search" element={<SearchPage/>} />
                    <Route path="/register" element={<GuestRouter><RegisterPage/></GuestRouter>} />
                    <Route path="/profile" element={<ProtectedRouter><Profile/></ProtectedRouter>}
                    />
                </Routes>
            </BrowserRouter>
    )
}