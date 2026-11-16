import MovieFinder from '../MovieFinder/MovieFinder'
import {NavLink} from 'react-router-dom'
import {useAuth} from "../../context/AuthContext.tsx";
import {useState} from "react";
import Loading from "../Loading/Loading.tsx";


const registerImg = '../../../log-in.svg'
const userImg = '../../../profile.svg'
const logo = '../../../logo.svg'

export function Header() {
    const {user, loading} = useAuth();



    return(
        <header id="header">
            <div className="header_block">
                <NavLink to='/'><img className={'logo'} src={logo}/></NavLink>
                <nav>
                    <MovieFinder/>
                    {loading ? (
                        <Loading/>
                    ) : user ? (
                        <NavLink to='/profile'>
                            <img className="register-img" src={userImg} alt="Profile" />
                        </NavLink>
                    ) : (
                        <NavLink to='/register'>
                            <img className="register-img" src={registerImg} alt="Log in" />
                        </NavLink>
                    )}
                </nav>

            </div>
        </header>
    )
}