import styles from '../../styles/Home.module.css';
import * as React from 'react';
import { getLeaderboardData, transformLeaderboardData } from '../../lib/utils';
import EnhancedTable from '../../components/Leaderboard';
import { getIndieRecordsFunction } from '../../lib/airtable';

export default function Home(props) {

  const { projectDataJson, indieDataJson } = props;
  const leaderboardData = getLeaderboardData(projectDataJson, indieDataJson, undefined, undefined, undefined, undefined);
  const { skills, leaderboardDataWithSkills } = transformLeaderboardData(leaderboardData);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Individual Contribution
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
  const indieDataJson = await getIndieRecordsFunction();


  return {
    props: {
      indieDataJson,
    },
    revalidate: 10,
  };
}
