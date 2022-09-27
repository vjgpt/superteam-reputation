import Link from 'next/link'
import useSWR from 'swr'
import Image from 'next/image'

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Navbar(props) {
    
    const { data , error } = useSWR('/api/airtableData/?query=title', fetcher)
    if (!data) return "Loading..";
    if (error) return "Failed to load";

    const { cabs, projects } = data;
    const projectIds = projects || [];
    
    const cabIds = cabs  || [];
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark border-b-[0.5px] border-b-[rgba(255, 255, 255, 0.2)]">
        <div style={{ width: '173px', height: '30px', cursor: 'pointer' }}>
            <Link href="https://superteam.fun">
                <Image src="/superteam.svg" width={173} height={30} alt="superteam logo"
                style={{borderRadius: '50%', cursor: 'pointer'}} />
            </Link>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav mr-auto mt-3 mt-lg-0 font-semibold text-sm ">
                <li className="nav-item ">
                <Link href="/"><a className="nav-link text-[#FFFF] font-archivo " >Leaderboard</a></Link>
                </li>
                <li className="nav-item">
                <Link href="/indie"><a className="nav-link text-[#FFFF] font-archivo" >Indie Work</a></Link>
                </li>
                <li className="nav-item">
                <Link href="/bounties"><a className="nav-link text-[#FFFF]" >Bounties</a></Link>
                </li>
                <li className="nav-item">
                <Link href="/braintrust"><a className="nav-link text-[#FFFF]" >Braintrust</a></Link>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link text-[#FFFF] dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Projects
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        {projectIds.map(id => (
                            <Link key={id} href={`/project/${id.replace(/ /g, '_').toLowerCase()}`}>
                                <a className="dropdown-item">{id}</a>
                            </Link>
                        ))}
                    </div>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link text-[#FFFF] dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    CAB & SubDAO
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        {cabIds.map(id => (
                            <Link key={id} href={`/cab/${id.replace(/ /g, '_').toLowerCase()}`}>
                                <a className="dropdown-item">{id}</a>
                            </Link>
                        ))}
                    </div>
                </li>
                <li className="nav-item">
                <Link href="/claimxp"><a className="nav-link text-[#FFFF]" >Claim XP Form</a></Link>
                </li>
            </ul>
        </div>
        </nav>
    )
}