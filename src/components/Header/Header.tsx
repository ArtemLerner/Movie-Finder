import MovieFinder from '../MovieFinder/MovieFinder'
import {NavLink} from 'react-router-dom'


const registerImg = '../../../log-in.svg'

export function Header() {
    return(
        <header id="header">
            <div className="header_block">
                <NavLink to='/'>Головна</NavLink>
                <nav>
                    <MovieFinder/>
                    <NavLink to='/register'><img className={'register-img'} src={registerImg}/></NavLink>
                </nav>
            </div>
        </header>
    )
}