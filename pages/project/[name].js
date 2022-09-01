import styles from '../../styles/Home.module.css';
import * as React from 'react';
import { getLeaderboardData, transformLeaderboardData } from '../../lib/utils';
import EnhancedTable from '../../components/Leaderboard';
import { getProjectsWorkRecordsFunction } from '../../lib/airtable';

const Projects = (project) => {
  const { projectDataJson, projectName  } = project;

  const leaderboardData = getLeaderboardData(projectDataJson, undefined, undefined, undefined);

  const { skills, leaderboardDataWithSkills } = transformLeaderboardData(leaderboardData);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {projectName}
        </h1>
        <EnhancedTable
          rows={leaderboardDataWithSkills}
          uniqueSkills={skills}
          />
      </main>
    </div>
  )
}

export default Projects;


function convertProjectNameToId(projectIds) {
  const pathsWithProjects = projectIds.map(id => ({
    params: { name: id.replace(/ /g, '_').toLowerCase() },
  }));
  return pathsWithProjects;
}

export const getStaticPaths = async () => {
  const projects = await getProjectsWorkRecordsFunction();
  const projectIds = Object.keys(projects);
  const paths = convertProjectNameToId(projectIds);

  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const name = context.params.name;
  const projectDataJson = await getProjectsWorkRecordsFunction();
  const projectIds = Object.keys(projectDataJson);
  const paths = convertProjectNameToId(projectIds);
  
  const hasPath = paths.findIndex(path => path.params.name === name);

  if (hasPath > -1) {
    const projectData = {
      [name]: projectDataJson[projectIds[hasPath]]
    };
    return {
      props: {
        projectDataJson: projectData,
        projectIds,
        projectName: projectDataJson[projectIds[hasPath]][0].project,
      },
      revalidate: 30,
    };
  }
}