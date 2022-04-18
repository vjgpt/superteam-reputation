import styles from '../styles/Home.module.css';
import * as React from 'react';
import EnhancedTable from '../components/Leaderboard';
import getNotionData from './api/notionData';

export default function Home({ data }) {

  let notionData = [];
  let uniqueSkills = ['Developer','Writer','Designer','Strategy','DAO Ops','Video'];
  
  data.bounty.forEach(item => {
    item.results.forEach(element => {
      let result_list = {};
      if ( element.properties.Skill.select != undefined ) {
        const skill = element.properties.Skill.select.name;
        result_list.id = element.id;
        result_list.username = element.properties.Name.title[0].plain_text;
        result_list.total_points = element.properties.Total.formula.number;
        result_list[skill] = element.properties.Total.formula.number;
        result_list.timestamp = element.last_edited_time;
        notionData.push(result_list);
      }
    });
  });

    data.project.forEach(element => {
      element.results.forEach(item => {
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
      }
    );
  });

    data.community.forEach(item => {
      item.results.map(element => {
        let result_list = {};

        // check if skill  is empty
        if (element.properties.Skill != undefined && element.properties.Skill.multi_select.length > 0) {
          const skill = element.properties.Skill.multi_select[0].name;
          result_list[skill] = element.properties.XP.formula.number;
        } else {
          return;
        }
        
        result_list.id = element.id;
        result_list.username = element.properties.Name.title[0].plain_text;
        result_list.total_points = element.properties.XP.formula.number;
        
        result_list.timestamp = element.last_edited_time;
        notionData.push(result_list);
      });
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
    const key = username.toLowerCase();
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
    };
  });
  sumGroupedData.sort((a,b) => (a.total_points < b.total_points) ? 1 : -1);

  return (
    
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://superteam.fun"> Superteam </a> Reputation Leaderboard
        </h1>
        <EnhancedTable
          rows={sumGroupedData}
          uniqueSkills={uniqueSkills}
          />
      </main>
    </div>
  )
}


export async function getStaticProps() {
  const { Client } = require('@notionhq/client');
  // Fetch data from external API
  const notion = new Client({ auth: 'secret_PcEOXPFmwMHxcXtaBFWX0hisC4xIpLEbdm1ZV1D7nP7' });
  
  const bountyDbDetails = [{
    id: "818772edb3104feb9e33d5dc862f69e9",
    name: "Writer Bounty Board"
  },
  {
    id: "a6370b552a874de1aa51d2f87806bf18",
    name: "Designer Bounty Board"
  }
]
  const filterCondition = {
    or: [
      {
        property: 'Name',
        title: {
          is_not_empty: true,
        },
      }
    ],
  }

  const bountyData = []
  const asyncRes = await Promise.all( bountyDbDetails.map(async item => {
    const data = await getNotionData(item.id, filterCondition);
    bountyData.push({...data})
  }))


  const projectDbDetails = [{
      id: "26c0661014d84b2eb12e6ae0eab79522",
      name: "Start on Solana"
    },
    {
      id: "245e90b6444c44b5932b28ff03b5ba53",
      name: "Ketto"
    },
    {
      id: "feadfa251c694ce1ad2a382b5de867aa",
      name: "Node Air"
    },
    {
      id: "041ff89f11804e5a844aac8b0e38abec",
      name: "Ground Zero Phase 1"
    },
    {
      id: "bbce78f6e8d245e382f7531b3c9b6ca3",
      name: "DAO Wiki"
    },
    {
      id: "365454dc2ec54010b8c0ade7060564cb",
      name: "Reputation System v1"
    },
    {
      id: "366313e791224e0ba706a1091b7764d9",
      name: "Member NFT"
    },
    {
      id: "4e75f881731849499806ca0dfc0115c9",
      name: "MapMyDAO"
    },
    {
      id: "77294283221146fbbd6c7e19376c18df",
      name: "Phantasia Video"
    },
    {
      id: "94f63b4c19a34e18ab19b6aa5f762384",
      name: "Member Onboarding Emails"
    },
    {
      id: "0bf0c7016bd3476097001942bb45d5fe",
      name: "Wagmi.bio"
    },
    {
      id: "a33c24df904a4430965798eb22af75a2",
      name: "Lurkers Got Talent"
    },
    {
      id: "0154f559b60b490c8283b53c7392fad9",
      name: "Diswallet"
    },
    {
      id: "043cd80f090548be8667492daadc13da",
      name: "Bounty Self Serve System"
    },
    {
      id: "4d905e90a9914c1bbcfa97e6e63d43d6",
      name: "Rust YouTube Series"
    },
  ]
  const projectFilterCondition = {
    or: [
      {
        property: 'Skill',
        multi_select: {
          is_not_empty: true,
        },
      }
    ],
  }

  const projectData = []
  const asyncProjectRes = await Promise.all( projectDbDetails.map(async item => {
    const data = await getNotionData(item.id, projectFilterCondition);
    projectData.push({...data})
  }))
  
  const communityDetails = [{
    id: "e9721f1938f0447aa0a3eedcfdaed726",
    name: "Brain Trust",
  },
  {
    id: "4c500329bb1949e794882f7be90a5f64",
    name: "Community Board"
  },
  {
    id: "24ac88db658748429cdf04e247792ea7",
    name: "Misc Community Work" 
  },  
  {
    id: "688cdab741e4420380f86b9293691a6d",
    name: "Event Organizers" 
  },
]
  const communityfilterCondition = {
    or: [
      {
        property: 'Name',
        title: {
          is_not_empty: true,
        },
      }
    ],
  }
  const commsData = []
  const asyncCommsRes = await Promise.all( communityDetails.map(async item => {
    const data = await getNotionData(item.id, communityfilterCondition);
    commsData.push({...data})
  }))

  const data = {
    bounty: bountyData,
    project: projectData,
    community: commsData,
  }

  // Pass data to the page via props
  return { props: { data },
  revalidate: 60, }
}
