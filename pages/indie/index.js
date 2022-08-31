import styles from '../../styles/Home.module.css';
import * as React from 'react';
import { getLeaderboardData, transformLeaderboardData } from '../../lib/utils';
import EnhancedTable from '../../components/Leaderboard';
import { getIndieRecordsFunction } from '../../lib/airtable';

export default function Home(props) {

  const { projectDataJson, indieDataJson } = props;
  const leaderboardData = getLeaderboardData(projectDataJson, indieDataJson);
  const { skills, leaderboardDataWithSkills } = transformLeaderboardData(leaderboardData);

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
  const indieDataJson = await getIndieRecordsFunction();


  return {
    props: {
      indieDataJson,
    },
    revalidate: 30,
  };
}
