import getNotionData from '../api/notionData';
import EnhancedTable from "../../components/Leaderboard";
import styles from '../../styles/Home.module.css'

export const getStaticPaths = async () => {
  const paths = [
    { params: { id: "6b531bc0f091468a864e8ce334818331" } },
    { params: { id: "e4cb2289279e4d788f278f54709afed0"} }, 
    { params: { id: "845963b6e2ee4bd69c6a84875d4b9494"} },
    { params: { id: "3ce34decd6154e80a5002c1c79125712"} },
    { params: { id: "0d143ef1e8674d96a686c31c399c423e"} },
  ];
  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const filterCondition = {
    or: [
      {
        property: 'Status',
        select: {
          equals: 'Completed',
        },
      }
    ],
  }
  const response = await getNotionData(id, filterCondition);
  const project = {
    ...response,
    id,
  }

  return {
    props: {
      project,
    },
    revalidate: 10,
  };
};

const Projects = ({ project}) => {
  
  let database_detail = ""
  const dbId = project.id
  if (dbId === "6b531bc0f091468a864e8ce334818331") {
    database_detail = "Reputation System"
  } else if (dbId === "e4cb2289279e4d788f278f54709afed0") {
    database_detail = "Member NFT"
  } else if (dbId === "845963b6e2ee4bd69c6a84875d4b9494") {
    database_detail = "BIP Implementation"
  } else if (dbId === "3ce34decd6154e80a5002c1c79125712") {
    database_detail = "Phantasia Video"
  } else if (dbId === "0d143ef1e8674d96a686c31c399c423e") {
    database_detail = "Web2 to Web3 Education"
  }

    const data = project;
    let notionData = []
    let uniqueSkills = ['Developer','Writer','Designer','Strategy','Videography']

    data.results.map(item => {
      // Fetch list of assignees
      const total_assignees = item.properties.Assignee.multi_select.length
      let assignee_list = []
      for (let i = 0; i < total_assignees; i++) {
        assignee_list.push(item.properties.Assignee.multi_select[i].name)
      }

      // Add details to assignee list
      for (let i = 0; i < total_assignees; i++) {
        let assignee_detail = {}
        
        assignee_detail.id = item.id
        assignee_detail.username = item.properties.Assignee.multi_select[i].name
        
        // Fetch list of skills
        if (item.properties.Skill != undefined && item.properties.Skill.multi_select.length > 0) {
          let skill_list = []
          for (let i = 0; i < item.properties.Skill.multi_select.length; i++) {
            assignee_detail[item.properties.Skill.multi_select[i].name] = item.properties.Points.formula.number
            skill_list.push(item.properties.Skill.multi_select[i].name)
          }
          assignee_detail.skills = skill_list
        } else {
          continue
        }
        assignee_detail.total_points = item.properties.Points.formula.number
        assignee_detail.timestamp = item.last_edited_time

        notionData.push(assignee_detail)
      }
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