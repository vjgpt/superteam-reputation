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
                {/* <li className="nav-item">
                <Link href="/dashboard"><a className="nav-link" >Dashboard</a></Link>
                </li> */}
                <li className="nav-item">
                <Link href="/bounty"><a className="nav-link" >Bounty Board</a></Link>
                </li>
                <li className="nav-item">
                <Link href="/community"><a className="nav-link" >Community</a></Link>
                </li>
                <li className="nav-item dropdown ">
                    <a className="nav-link dropdown-toggle"  id="navbarDropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    Projects
                    </a>
                    <div className="dropdown-menu m-0" aria-labelledby="navbarDropdown">
                    <Link href="/project/6b531bc0f091468a864e8ce334818331"><a className="dropdown-item" >Reputation System</a></Link>
                    <Link href="/project/e4cb2289279e4d788f278f54709afed0"><a className="dropdown-item" >Member NFT</a></Link>
                    <Link href="/project/845963b6e2ee4bd69c6a84875d4b9494"><a className="dropdown-item" >BIP Implementation</a></Link>
                    <Link href="/project/3ce34decd6154e80a5002c1c79125712"><a className="dropdown-item" >Phantasia Video</a></Link>
                    <Link href="/project/0d143ef1e8674d96a686c31c399c423e"><a className="dropdown-item" >Web2 to Web3 Education</a></Link>
                    </div>
                </li>
            </ul>
        </div>
        </nav>
    )
}