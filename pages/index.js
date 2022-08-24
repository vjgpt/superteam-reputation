import styles from '../styles/Home.module.css';
import * as React from 'react';
import { getLeaderboardData } from '../lib/utils';
import EnhancedTable from '../components/Leaderboard';
import { getIndieRecordsFunction, getCommunityRecordsFunction, getProjectsWorkRecordsFunction, getProjectTitleFunction } from '../lib/airtable';

export default function Home(props) {

  const { projectDataJson, indieDataJson } = props;
  const leaderboardData = getLeaderboardData(projectDataJson, indieDataJson);

  // get the unique skills from the leaderboard data
  let skills = []
  leaderboardData.forEach(({ name, ...rest }) => {
    skills = [...skills, ...Object.keys(rest)]
  }
  )
  skills = [...new Set(skills)]

  // make a new array of objects with the skills and the xp for each skill and a total xp
  const leaderboardDataWithSkills = leaderboardData.map(({ name, ...rest }) => {
    const newObject = { name }
    newObject.username = name

    skills.forEach(skill => {
      // float to int for the xp
      newObject[skill] = Math.floor(rest[skill] || 0)
    }
    )
    newObject.total_points = Object.values(rest).reduce((acc, cur) => {
      if (typeof cur === 'number') {
        return Math.floor(acc) + Math.floor(cur);
      }
      return Math.floor(acc);
    }, 0)
    return newObject
  }
  )
  
  return (
    
    <div className={styles.container}>
      <main className={styles.main}>
        <EnhancedTable
          rows={leaderboardDataWithSkills}
          uniqueSkills={skills}
          />
      </main>
    </div>
  )
}

export async function getStaticProps () {
  const projectDataJson = await getProjectsWorkRecordsFunction();
 
  const indieDataJson = await getIndieRecordsFunction();


  return {
    props: {
      projectDataJson,
      indieDataJson,
    },
    revalidate: 30,
  };
}
