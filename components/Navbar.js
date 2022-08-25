import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light">
        <Link href="https://superteam.fun"><img className="navbar-brand" src="favicon.ico" width={45} height={50} alt="superteam logo"
            style={{borderRadius: '50%', cursor: 'pointer'}}
        /></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav mr-auto mt-3 mt-lg-0">
                <li className="nav-item active">
                <Link href="/"><a className="nav-link" >Leaderboard</a></Link>
                </li>
                <li className="nav-item">
                <Link href="/indie"><a className="nav-link" >Indie Work</a></Link>
                </li>
                {/* <li className="nav-item">
                <Link href="/community"><a className="nav-link" >Community</a></Link>
                </li>
                <li className="nav-item dropdown ">
                    <a className="nav-link dropdown-toggle"  id="navbarDropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    Projects
                    </a>
                    <div className="dropdown-menu m-0" aria-labelledby="navbarDropdown">
                    <Link href="/project/26c0661014d84b2eb12e6ae0eab79522"><a className="dropdown-item" >Start on Solana</a></Link>
                    <Link href="/project/245e90b6444c44b5932b28ff03b5ba53"><a className="dropdown-item" >Ketto</a></Link>
                    <Link href="/project/feadfa251c694ce1ad2a382b5de867aa"><a className="dropdown-item" >Node Air</a></Link>
                    <Link href="/project/041ff89f11804e5a844aac8b0e38abec"><a className="dropdown-item" >Ground Zero Phase 1</a></Link>
                    <Link href="/project/bbce78f6e8d245e382f7531b3c9b6ca3"><a className="dropdown-item" >DAO Wiki</a></Link>
                    <Link href="/project/365454dc2ec54010b8c0ade7060564cb"><a className="dropdown-item" >Reputation System v1</a></Link>
                    <Link href="/project/366313e791224e0ba706a1091b7764d9"><a className="dropdown-item" >Member NFT</a></Link>
                    <Link href="/project/4e75f881731849499806ca0dfc0115c9"><a className="dropdown-item" >MapMyDAO</a></Link>
                    <Link href="/project/77294283221146fbbd6c7e19376c18df"><a className="dropdown-item" >Phantasia Video</a></Link>
                    <Link href="/project/94f63b4c19a34e18ab19b6aa5f762384"><a className="dropdown-item" >Member Onboarding Emails</a></Link>
                    <Link href="/project/0bf0c7016bd3476097001942bb45d5fe"><a className="dropdown-item" >Wagmi.bio</a></Link>
                    <Link href="/project/a33c24df904a4430965798eb22af75a2"><a className="dropdown-item" >Lurkers Got Talent</a></Link>
                    <Link href="/project/0154f559b60b490c8283b53c7392fad9"><a className="dropdown-item" >Diswallet</a></Link>
                    <Link href="/project/043cd80f090548be8667492daadc13da"><a className="dropdown-item" >Bounty Self Serve System</a></Link>
                    <Link href="/project/4d905e90a9914c1bbcfa97e6e63d43d6"><a className="dropdown-item" >Rust YouTube Series</a></Link>
                    <Link href="/project/9a80e006cb044a159e3c52894d911795"><a className="dropdown-item" >Anita&apos;s NFT Project</a></Link>
                    <Link href="/project/c0afb7d94ad048d790796b66a72ff792"><a className="dropdown-item" >Attend.bio</a></Link>
                    </div>
                </li> */}
            </ul>
        </div>
        </nav>
    )
}