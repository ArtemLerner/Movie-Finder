import MovieFinder from '../MovieFinder/MovieFinder'
import {NavLink} from 'react-router-dom'
import {useAuth} from "../../context/AuthContext.tsx";


const registerImg = '../../../log-in.svg'
const userImg = '../../../profile.svg'


export function Header() {
    const {user} = useAuth();

    return(
        <header id="header">
            <div className="header_block">
                <NavLink to='/'>Головна</NavLink>
                <nav>
                    <MovieFinder/>

                    <NavLink to='/register'>
                        {user ?
                            <img className={'register-img'} src={userImg}/>
                            :
                            <img className={'register-img'} src={registerImg}/>
                        }
                    </NavLink>
                </nav>

            </div>
        </header>
    )
}