import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage.tsx";
import SearchPage from "../pages/SearchPage/SearchPage.tsx";
import {Header} from "../components/Header/Header.tsx";
import RegisterPage from "../pages/RegisterPage/RegisterPage.tsx";
import Profile from "../pages/ProfilePage";
import {AuthProvider} from "../context/AuthContext.tsx";



export function Router() {

    return(
        <AuthProvider>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/search" element={<SearchPage/>} />
                    <Route path="/register" element={<RegisterPage/>} />
                    <Route path="/profile" element={<Profile/>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )

}