import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as React from 'react';
import EnhancedTable from '../components/Leaderboard';
import Chart from 'chart.js/auto';
import DoughnutGraph from '../components/DoughnutGraph';

const { Client } = require('@notionhq/client');

export default function Home({ data }) {
  let total_skills = [];
  const notionData = data.results.map(item => {
    let result_list = {}
    result_list.id = item.id
    result_list.username = item.properties.Engineers.people[0].name
    result_list.points = item.properties.Points.rich_text[0].plain_text.slice(0, -2)

    if (item.properties.Skills != undefined && item.properties.Skills.multi_select.length > 0) {
      let skill_list = []
      for (let i = 0; i < item.properties.Skills.multi_select.length; i++) {
        result_list[item.properties.Skills.multi_select[i].name] = item.properties.Points.rich_text[0].plain_text.slice(0, -2)
        skill_list.push(item.properties.Skills.multi_select[i].name)
        total_skills.push(item.properties.Skills.multi_select[i].name)
      }
      result_list.skills = skill_list
    }
    result_list.total_points = item.properties.Points.rich_text[0].plain_text.slice(0, -2)
    result_list.timestamp = item.last_edited_time

    return {
      ...result_list  
    }
  })
  let uniqueSkills = [...new Set(total_skills)]

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
    const key = username
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
      id: key,
      ...skill_points,
      total_points: values.reduce((acc, item) => acc + parseInt(item.total_points), 0),
      timestamp: values[0].timestamp
    }
  })

  return (
    
    <div className={styles.container}>
      <Head>
        <title>Reputation Leaderboard</title>
        <meta name="description" content="Reputation Leaderboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://superteam.fun">Superteam</a> Reputation Leaderboard
        </h1>

        <EnhancedTable
          rows={sumGroupedData}
          uniqueSkills={uniqueSkills}
          />

        <DoughnutGraph 
          rows={sumGroupedData}
          uniqueSkills={uniqueSkills}
        />

      </main>

      <footer className={styles.footer}>
        Copyright &copy; {new Date().getFullYear()} Superteam
      </footer>
    </div>
  )
}


export async function getServerSideProps() {
  // Fetch data from external API
  const notion = new Client({ auth: 'secret_PcEOXPFmwMHxcXtaBFWX0hisC4xIpLEbdm1ZV1D7nP7' });
  const res = await notion.databases.query({
    database_id: '7c10df77534f43399203609b0d2ae5c2',
    filter: {
      or: [
        {
          property: 'Status',
          select: {
            equals: 'Complete',
          },
        }
      ],
    },
    sorts: [
      {
        timestamp: 'last_edited_time',
        direction: 'descending',
      },
    ],
  });

  const data = await res

  // Pass data to the page via props
  return { props: { data } }
}
