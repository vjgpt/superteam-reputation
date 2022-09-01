import Image from 'next/image'
import styles from '../styles/TopRank.module.css'

export default function TopRanking() {
    return (
            <div className={styles.contentRow1}>
                <div className={styles.wrapper}>
                <ul>
                
                <li>
                <div className={styles.imgBox}>
                <Image src="/2.jpg" width="200" height="200"/>
            
                </div>
                <h3><span className={styles.count}>2</span></h3>
                <h2>Pallavi</h2>
                </li>
                <li>
                <div className={styles.crown}><Image src="/crown-1.png" width="64" height="64"/></div>
                <div className={styles.imgBox}>
                
                <Image src="/2.jpg" width="200" height="200"/>
                </div>
                <span className={styles.count}>1</span>
                <h2>Pallavi</h2>
                </li>
                <li>
                <div className={styles.imgBox}>
                
                <Image src="/2.jpg" width="200" height="200"/>
                </div>
                <span className={styles.count}>3</span>
                <h2>Pallavi</h2>
                </li>
                </ul>
                </div>
            </div>

    )
}