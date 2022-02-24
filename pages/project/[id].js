import getNotionData from '../api/notionData';
import EnhancedTable from "../../components/Leaderboard";
import styles from '../../styles/Home.module.css'

export const getStaticPaths = async () => {
  const paths = [
    { params: { id: "26c0661014d84b2eb12e6ae0eab79522" } },
    { params: { id: "245e90b6444c44b5932b28ff03b5ba53"} }, 
    { params: { id: "feadfa251c694ce1ad2a382b5de867aa"} },
    { params: { id: "041ff89f11804e5a844aac8b0e38abec"} },
    { params: { id: "bbce78f6e8d245e382f7531b3c9b6ca3"} },
    { params: { id: "365454dc2ec54010b8c0ade7060564cb"} },
    { params: { id: "366313e791224e0ba706a1091b7764d9"} },
    { params: { id: "4e75f881731849499806ca0dfc0115c9"} },
    { params: { id: "77294283221146fbbd6c7e19376c18df"} },
    { params: { id: "94f63b4c19a34e18ab19b6aa5f762384"} },
    { params: { id: "0bf0c7016bd3476097001942bb45d5fe"} },
    { params: { id: "a33c24df904a4430965798eb22af75a2"} },
    { params: { id: "0154f559b60b490c8283b53c7392fad9"} },
    { params: { id: "043cd80f090548be8667492daadc13da"} },
  ];
  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const filterCondition = {
    or: [
      {
        property: 'Skill',
        multi_select: {
          is_not_empty: true,
        },
      }
    ],
  };
  const response = await getNotionData(id, filterCondition);
  const project = {
    ...response,
    id,
  };

  return {
    props: {
      project,
    },
    revalidate: 10,
  };
};

const Projects = ({ project}) => {
  
  let database_detail = "";
  const dbId = project.id;
  if (dbId === "26c0661014d84b2eb12e6ae0eab79522") {
    database_detail = "Start on Solana";
  } else if (dbId === "245e90b6444c44b5932b28ff03b5ba53") {
    database_detail = "Ketto";
  } else if (dbId === "feadfa251c694ce1ad2a382b5de867aa") {
    database_detail = "Node Air";
  } else if (dbId === "041ff89f11804e5a844aac8b0e38abec") {
    database_detail = "Ground Zero Phase 1";
  } else if (dbId === "bbce78f6e8d245e382f7531b3c9b6ca3") {
    database_detail = "DAO Wiki";
  } else if (dbId === "365454dc2ec54010b8c0ade7060564cb") {
    database_detail = "Reputation System v1";
  } else if (dbId === "366313e791224e0ba706a1091b7764d9") {
    database_detail = "Member NFT";
  } else if (dbId === "4e75f881731849499806ca0dfc0115c9") {
    database_detail = "MapMyDAO";
  } else if (dbId === "77294283221146fbbd6c7e19376c18df") {
    database_detail = "Phantasia Video";
  } else if (dbId === "94f63b4c19a34e18ab19b6aa5f762384") {
    database_detail = "Member Onboarding Emails";
  } else if (dbId === "0bf0c7016bd3476097001942bb45d5fe") {
    database_detail = "Wagmi.bio";
  } else if (dbId === "a33c24df904a4430965798eb22af75a2") {
    database_detail = "Lurkers Got Talent";
  } else if (dbId === "0154f559b60b490c8283b53c7392fad9") {
    database_detail = "Diswallet";
  } else if (dbId === "043cd80f090548be8667492daadc13da") {
    database_detail = "Bounty Self Serve System";
  }

    const data = project;
    const notionData = [];
    let uniqueSkills = ['Developer','Writer','Designer','Strategy','DAO Ops','Video'];

    data.results.map(item => {
      // Fetch list of assignees
      const total_assignees = item.properties['Contributor Name'].multi_select.length;
      let assignee_list = [];
      for (let i = 0; i < total_assignees; i++) {
        assignee_list.push(item.properties['Contributor Name'].multi_select[i].name);
      }

      // Add details to assignee list
      for (let i = 0; i < total_assignees; i++) {
        let assignee_detail = {};
        
        assignee_detail.id = item.id + "_" + i;
        assignee_detail.username = item.properties['Contributor Name'].multi_select[i].name;
        
        // Fetch list of skills
        if (item.properties.Skill != undefined && item.properties.Skill.multi_select.length > 0) {
          let skill_list = [];
          for (let i = 0; i < item.properties.Skill.multi_select.length; i++) {
            assignee_detail[item.properties.Skill.multi_select[i].name] = item.properties.XP.formula.number;
            skill_list.push(item.properties.Skill.multi_select[i].name);
          }
          assignee_detail.skills = skill_list;
        } else {
          continue;
        }
        assignee_detail.total_points = item.properties.XP.formula.number;
        assignee_detail.timestamp = item.last_edited_time;

        notionData.push(assignee_detail);
      }
    });

    const data_list = notionData.map(item => {
      let data = [];
      const header =  Object.keys(item);
      let difference = uniqueSkills.filter(x => !header.includes(x));
      for (let i = 0; i < difference.length; i++) {
        data[difference[i]] = 0;
      }
      return {
        ...item,
        ...data
      };
    });
  
    const groupedData = data_list.reduce((acc, item) => {
      const { id, username, total_points, timestamp } = item;
      const key = username;
      const value = {
        ...item,
        timestamp
      };
      if (!acc[key]) {
        acc[key] = [value];
      } else {
        acc[key].push(value);
      }
      return acc;
    }, {});
  
    const sumGroupedData = Object.keys(groupedData).map(key => {
      const values = groupedData[key];
      const skill_points = {};
      for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < uniqueSkills.length; j++) {
          if (values[i][uniqueSkills[j]] != undefined) {
            if (skill_points[uniqueSkills[j]] == undefined) {
              skill_points[uniqueSkills[j]] = parseInt(values[i][uniqueSkills[j]]);
            } else {
              skill_points[uniqueSkills[j]] += parseInt(values[i][uniqueSkills[j]]);
            }
          }
        }
      }
  
      return {
        id: values[0].id,
        username: key,
        ...skill_points,
        total_points: values.reduce((acc, item) => acc + parseInt(item.total_points), 0),
        timestamp: values[0].timestamp
      }
    })
    sumGroupedData.sort((a,b) => (a.total_points < b.total_points) ? 1 : -1)

  return (
    <div>
        <main className={styles.main}>
          <h1 className={styles.title}>
            {database_detail}
          </h1>

          <EnhancedTable
            rows={sumGroupedData}
            uniqueSkills={uniqueSkills}
            />

      </main>
    </div>
  );
};

export default Projects;