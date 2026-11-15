import MovieFinder from '../MovieFinder/MovieFinder'
import {NavLink} from 'react-router-dom'
import {useAuth} from "../../context/AuthContext.tsx";


const registerImg = '../../../log-in.svg'
const userImg = '../../../profile.svg'
const logo = '../../../logo.svg'

export function Header() {
    const {user} = useAuth();


    return(
        <header id="header">
            <div className="header_block">
                <NavLink to='/'><img className={'logo'} src={logo}/></NavLink>
                <nav>
                    <MovieFinder/>
                        {user ?
                            <NavLink to='/profile'> <img className={'register-img'} src={userImg}/></NavLink>
                            :
                            <NavLink to='/register'><img className={'register-img'} src={registerImg}/></NavLink>
                        }
                </nav>

            </div>
        </header>
    )
}