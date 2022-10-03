import styles from '../styles/Home.module.css';
import * as React from 'react'
import EnhancedTable from '../components/Leaderboard';
import { getLeaderboardData, transformLeaderboardData } from '../lib/utils';
import { getIndieRecordsFunction, getProjectsWorkRecordsFunction, getCabsRecordsFunction, getBountiesRecordsFunction, getBrainTrustRecordsFunction, getStackXpRecordsFunction } from '../lib/airtable';

export default function Home(props) {

  const { projectDataJson, indieDataJson, cabsDataJson, bountyDataJson, btDataJson, stackXpDataJson } = props;
  const leaderboardData = getLeaderboardData(projectDataJson, indieDataJson, cabsDataJson, bountyDataJson, btDataJson, stackXpDataJson);

  // get the unique skills from the leaderboard data
  let skills = []
  leaderboardData.forEach(({ name, ...rest }) => {
    skills = [...skills, ...Object.keys(rest)]
  }
  )
  skills = [...new Set(skills)]
  if (skills.includes('DAO Ops (incl. Brain Trust)')) {
    // rename the skill to Brain Trust
    skills = skills.map(skill => skill === 'DAO Ops (incl. Brain Trust)' ? 'Brain Trust' : skill)
  }

  // make a new array of objects with the skills and the xp for each skill and a total xp
  const leaderboardDataWithSkills = leaderboardData.map(({ name, ...rest }) => {
    const newObject = { name }
    newObject.username = name
    delete newObject.name

    skills.forEach(skill => {
      // float to int for the xp
      newObject[skill] = Math.floor(rest[skill] || 0)

      // if the skill name is 'Brain Trust', add the xp from DAO Ops (incl. Brain Trust)
      if (skill === 'Brain Trust') {
        newObject[skill] += Math.floor(rest['DAO Ops (incl. Brain Trust)'] || 0)
      }

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
        <h1 className={styles.title}>
          Superteam Reputation Leaderboard
        </h1>
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

  const cabsDataJson = await getCabsRecordsFunction();

  const bountyDataJson = await getBountiesRecordsFunction();

  const btDataJson = await getBrainTrustRecordsFunction();

  const stackXpDataJson = await getStackXpRecordsFunction();

  return {
    props: {
      projectDataJson,
      indieDataJson,
      cabsDataJson,
      bountyDataJson,
      btDataJson,
      stackXpDataJson,
    },
    revalidate: 10,
  };
}
