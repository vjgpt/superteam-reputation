import styles from '../styles/Home.module.css';
import * as React from 'react'
import EnhancedTable from '../components/Leaderboard';
import { getLeaderboardData, transformLeaderboardData } from '../lib/utils';
import { getIndieRecordsFunction, getProjectsWorkRecordsFunction, getCabsRecordsFunction, getBountiesRecordsFunction, getBrainTrustRecordsFunction } from '../lib/airtable';

export default function Home(props) {

  const { projectDataJson, indieDataJson, cabsDataJson, bountyDataJson, btDataJson } = props;
  const leaderboardData = getLeaderboardData(projectDataJson, indieDataJson, cabsDataJson, bountyDataJson, btDataJson);

  const { skills, leaderboardDataWithSkills } = transformLeaderboardData(leaderboardData);

  // create a search function
  const [search, setSearch] = React.useState('');
  const [filteredData, setFilteredData] = React.useState(leaderboardDataWithSkills);

  React.useEffect(() => {
    const filteredData = leaderboardDataWithSkills.filter(({ username }) => {
      return username.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredData(filteredData);
  }, [search, leaderboardDataWithSkills]);


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Superteam Reputation Leaderboard
        </h1>
        <EnhancedTable
          rows={filteredData}
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

  return {
    props: {
      projectDataJson,
      indieDataJson,
      cabsDataJson,
      bountyDataJson,
      btDataJson,
    },
    revalidate: 30,
  };
}
