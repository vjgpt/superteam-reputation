import styles from '../../styles/Home.module.css';
import * as React from 'react';
import { getLeaderboardData, transformLeaderboardData } from '../../lib/utils';
import EnhancedTable from '../../components/Leaderboard';
import { getStackXpRecordsFunction } from '../../lib/airtable';

export default function Home(props) {

  const { stackXpDataJson } = props;
  const leaderboardData = getLeaderboardData(undefined, undefined, undefined, undefined, undefined, stackXpDataJson);
  const { skills, leaderboardDataWithSkills } = transformLeaderboardData(leaderboardData);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Stack Exchange Contribution
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
  const stackXpDataJson = await getStackXpRecordsFunction();

  return {
    props: {
      stackXpDataJson,
    },
    revalidate: 10,
  };
}
