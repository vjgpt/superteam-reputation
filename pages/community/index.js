import getNotionData from "../api/notionData";
import EnhancedTable from "../../components/Leaderboard";
import styles from '../../styles/Home.module.css'

export const getStaticProps = async (context) => {
  const dbDetails = [{
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
    revalidate: 10,
  };
};

const Projects = ({ projectData }) => {
  let notionData = []
  let uniqueSkills = ['DAO Ops','Community', 'Developer']

  projectData.forEach(item => {
    item.results.map(element => {
    let result_list = {}

    // check if skill is empty or not and add points to it
    if (element.properties.Skill != undefined && element.properties.Skill.multi_select.length > 0) {
      const skill = element.properties.Skill.multi_select[0].name
      result_list[skill] = element.properties.XP.formula.number
    } else {
      return;
    }
    
    result_list.id = element.id
    result_list.username = element.properties.Name.title[0].plain_text
    result_list.total_points = element.properties.XP.formula.number
    
    result_list.timestamp = element.last_edited_time
    notionData.push(result_list)
    })
  })

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
          <a href="https://superteam.fun">Superteam</a> Community Leaderboard
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