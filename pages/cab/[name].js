import styles from '../../styles/Home.module.css';
import * as React from 'react';
import { getLeaderboardData, transformLeaderboardData } from '../../lib/utils';
import EnhancedTable from '../../components/Leaderboard';
import { getCabsRecordsFunction, getProjectsWorkRecordsFunction } from '../../lib/airtable';

const Cabs = (project) => {
  const { cabDataJson, cabName } = project;

  const leaderboardData = getLeaderboardData(cabDataJson, undefined, undefined, undefined);

  const { skills, leaderboardDataWithSkills } = transformLeaderboardData(leaderboardData);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {cabName}
        </h1>
        <EnhancedTable
          rows={leaderboardDataWithSkills}
          uniqueSkills={skills}
          />
      </main>
    </div>
  )
}

export default Cabs;


function convertCabNameToId(cabIds) {
  const pathsWithProjects = cabIds.map(id => ({
    params: { name: id.replace(/ /g, '_').toLowerCase() },
  }));
  return pathsWithProjects;
}

export const getStaticPaths = async () => {
  const projects = await getCabsRecordsFunction();
  const cabIds = Object.keys(projects);
  const paths = convertCabNameToId(cabIds);
  console.log(paths);
  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const name = context.params.name;
  const cabDataJson = await getCabsRecordsFunction();
  const cabIds = Object.keys(cabDataJson);
  const paths = convertCabNameToId(cabIds);
  
  const hasPath = paths.findIndex(path => path.params.name === name);

  if (hasPath > -1) {
    const projectData = {
      [name]: cabDataJson[cabIds[hasPath]]
    };
    return {
      props: {
        cabDataJson: projectData,
        cabIds,
        cabName: cabDataJson[cabIds[hasPath]][0].cab
      },
      revalidate: 30,
    };
  }
}