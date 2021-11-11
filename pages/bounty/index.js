import getNotionData from "../api/notionData";
import EnhancedTable from "../../components/Leaderboard";
import styles from '../../styles/Home.module.css'

export const getStaticProps = async (context) => {
  const dbDetails = [{
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

  const projectData = []
  const asyncRes = await Promise.all( dbDetails.map(async item => {
    const data = await getNotionData(item.id, filterCondition);
    projectData.push({...data})
  }))
  
  return {
    props: {
      projectData,
    },
  };
};

const Projects = ({ projectData }) => {
  let notionData = []
  let uniqueSkills = ['Developer','Writer','Designer','Strategy']
  
  projectData.forEach(item => {
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
          <a href="https://superteam.fun">Superteam</a> Bounty Leaderboard
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