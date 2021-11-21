import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as React from 'react';
import EnhancedTable from '../components/Leaderboard';
import getNotionData from './api/notionData';

export default function Home({ data }) {

  let notionData = []
  let uniqueSkills = ['Developer','Writer','Designer','Strategy','DAO Ops']
  
  data['bounty'].forEach(item => {
    item.results.forEach(element => {
      let result_list = {}
      const skill = element.properties.Skill.select.name
      result_list.id = element.id
      result_list.username = element.properties.Name.title[0].plain_text
      result_list.total_points = element.properties.Total.formula.number
      result_list[skill] = element.properties.Total.formula.number
      result_list.timestamp = element.last_edited_time
      notionData.push(result_list)
    }
    )})

    data['project'].forEach(element => {
      element.results.forEach(item => {
        let result_list = {}
        result_list.id = item.id
        result_list.username = item.properties.Assignee.select.name
        result_list.points = item.properties.Points.number
    
        if (item.properties.Skill != undefined && item.properties.Skill.multi_select.length > 0) {
          let skill_list = []
          for (let i = 0; i < item.properties.Skill.multi_select.length; i++) {
            result_list[item.properties.Skill.multi_select[i].name] = item.properties.Points.number
            skill_list.push(item.properties.Skill.multi_select[i].name)
          }
          result_list.skills = skill_list
        }
        result_list.total_points = item.properties.Points.number
        result_list.timestamp = item.last_edited_time
        notionData.push(result_list)
        return {
          ...result_list  
        }
      }
      )})

    data['community'].results.map(element => {
        let result_list = {}
        const skill = element.properties.Skill.multi_select[0].name
        result_list.id = element.id
        result_list.username = element.properties.Name.title[0].plain_text
        result_list.total_points = element.properties.XP.formula.number
        result_list[skill] = element.properties.XP.formula.number
        result_list.timestamp = element.last_edited_time
        notionData.push(result_list)
      }
      )


      const data_list = notionData.map(item => {
        let data = []
        const header =  Object.keys(item)
        let difference = uniqueSkills.filter(x => !header.includes(x));
        for (let i = 0; i < difference.length; i++) {
          data[difference[i]] = 0
        }
        return {
          ...item,
          ...data
        }
      })

  const groupedData = data_list.reduce((acc, item) => {
    const { id, username, total_points, timestamp } = item
    const key = username.toLowerCase();
    const value = {
      ...item,
      timestamp
    }
    if (!acc[key]) {
      acc[key] = [value]
    } else {
      acc[key].push(value)
    }
    return acc
  }, {})

  const sumGroupedData = Object.keys(groupedData).map(key => {
    const values = groupedData[key]
    const skill_points = {}
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < uniqueSkills.length; j++) {
        if (values[i][uniqueSkills[j]] != undefined) {
          if (skill_points[uniqueSkills[j]] == undefined) {
            skill_points[uniqueSkills[j]] = parseInt(values[i][uniqueSkills[j]])
          } else {
            skill_points[uniqueSkills[j]] += parseInt(values[i][uniqueSkills[j]])
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
    
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://superteam.fun">Superteam</a> Reputation Leaderboard
        </h1>
          {/* <p>{JSON.stringify(data)}</p> */}
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
      id: "6b531bc0f091468a864e8ce334818331",
      name: "Reputation System"
    },
    {
      id: "e4cb2289279e4d788f278f54709afed0",
      name: "Member NFT"
    }
  ]
  const projectFilterCondition = {
    or: [
      {
        property: 'Status',
        select: {
          equals: 'Completed',
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
      name: "Community Board"
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
  let commsData = ''
  const asyncCommsRes = await Promise.all( communityDetails.map(async item => {
    const data = await getNotionData(item.id, filterCondition);
    commsData = data
  }))
  

  const data = {
    bounty: bountyData,
    project: projectData,
    community: commsData,
  }

  // Pass data to the page via props
  return { props: { data },
  revalidate: 10, }
}
