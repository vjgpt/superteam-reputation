import styles from '../../styles/Home.module.css';
import * as React from 'react';
import { getLeaderboardData, transformLeaderboardData } from '../../lib/utils';
import EnhancedTable from '../../components/Leaderboard';
import { getBountiesRecordsFunction, getIndieRecordsFunction } from '../../lib/airtable';

export default function Home(props) {

  const { bountyDataJson } = props;
  const leaderboardData = getLeaderboardData(undefined, bountyDataJson, undefined, undefined, undefined, undefined);
  const { skills, leaderboardDataWithSkills } = transformLeaderboardData(leaderboardData);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Bounties Contribution
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
  const bountyDataJson = await getBountiesRecordsFunction();

  return {
    props: {
      bountyDataJson,
    },
    revalidate: 10,
  };
}
