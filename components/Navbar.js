import Link from 'next/link'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
    return (
        <nav class="navbar navbar-expand-lg navbar-light">
        <Link href="https:/superteam.fun"><a class="navbar-brand" >Superteam</a></Link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul class="navbar-nav mr-auto mt-3 mt-lg-0">
            <li class="nav-item active">
            <Link href="/"><a class="nav-link" >Leaderboard</a></Link>
            </li>
            <li class="nav-item">
            <Link href="/dashboard"><a class="nav-link" >Dashboard</a></Link>
            </li>
            <li class="nav-item">
            <Link href="/bounty"><a class="nav-link" >Bounty Board</a></Link>
            </li>
            <li class="nav-item dropdown ">
                <a class="nav-link dropdown-toggle"  id="navbarDropdown" role="button" aria-haspopup="true" aria-expanded="false">
                Projects
                </a>
                <div class="dropdown-menu m-0" aria-labelledby="navbarDropdown">
                <Link href="/project/7c10df77534f43399203609b0d2ae5c2"><a class="dropdown-item" >Reputation System</a></Link>
                <Link href="/project/d2c8414f2b014c32840f9aa80bce6d08"><a class="dropdown-item" >Mission 5K</a></Link>
                <Link href="/project/d2c8414f2b014c32840f9aa80bce6d08"><a class="dropdown-item" >Web2 to Web3 Education</a></Link>
                </div>
            </li>
            </ul>
        </div>
        </nav>
    )
}