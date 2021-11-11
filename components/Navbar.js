import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light">
        <Link href="https:/superteam.fun"><a className="navbar-brand" >Superteam</a></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav mr-auto mt-3 mt-lg-0">
            <li className="nav-item active">
            <Link href="/"><a className="nav-link" >Leaderboard</a></Link>
            </li>
            <li className="nav-item">
            <Link href="/dashboard"><a className="nav-link" >Dashboard</a></Link>
            </li>
            <li className="nav-item">
            <Link href="/bounty"><a className="nav-link" >Bounty Board</a></Link>
            </li>
            <li className="nav-item dropdown ">
                <a className="nav-link dropdown-toggle"  id="navbarDropdown" role="button" aria-haspopup="true" aria-expanded="false">
                Projects
                </a>
                <div className="dropdown-menu m-0" aria-labelledby="navbarDropdown">
                <Link href="/project/7c10df77534f43399203609b0d2ae5c2"><a className="dropdown-item" >Reputation System</a></Link>
                <Link href="/project/d2c8414f2b014c32840f9aa80bce6d08"><a className="dropdown-item" >Mission 5K</a></Link>
                <Link href="/project/d2c8414f2b014c32840f9aa80bce6d08"><a className="dropdown-item" >Web2 to Web3 Education</a></Link>
                </div>
            </li>
            </ul>
        </div>
        </nav>
    )
}