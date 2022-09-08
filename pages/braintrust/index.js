import styles from '../../styles/Home.module.css';
import * as React from 'react';
import { getLeaderboardData, transformLeaderboardData } from '../../lib/utils';
import EnhancedTable from '../../components/Leaderboard';
import { getBrainTrustRecordsFunction } from '../../lib/airtable';

export default function Home(props) {

  const { btDataJson } = props;
  const leaderboardData = getLeaderboardData(undefined, btDataJson, undefined, undefined, undefined);
  const { skills, leaderboardDataWithSkills } = transformLeaderboardData(leaderboardData);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Braintrust Contribution
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
  const btDataJson = await getBrainTrustRecordsFunction();

  return {
    props: {
      btDataJson,
    },
    revalidate: 30,
  };
}
