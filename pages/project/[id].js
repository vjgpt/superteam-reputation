import getNotionData from '../api/notionData';
import EnhancedTable from "../../components/Leaderboard";
import styles from '../../styles/Home.module.css'

export const getStaticPaths = async () => {
  const paths = [
    { params: { id: "6b531bc0f091468a864e8ce334818331" } },
    { params: { id: "e4cb2289279e4d788f278f54709afed0"} },
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

  // const database_detail = "Reputation System"

  // const dbname = "DATABASE"
  // const dbname = database_detail.results.map(item => {
  //   let name = ""
  //   if (item.id == id) {
  //     name = item.title.plain_text
  //   }
  //   return {
  //     ...name
  //   }
  // })
  // for(let i = 0; i < database_detail.results.length; i++){
  //   if(database_detail[i].name === "Total"){
  //     const total = database_detail[i].value;
  //     project.total = total;
  //   }
  // }
  // const database_name = () => database_detail.results.map(item => {
  //   if (item.id == id) {
  //     return item.title.plain_text
  //   }
  // });

  return {
    props: {
      project,
    },
  };
};

const Projects = ({ project}) => {
  let database_detail = ""
  const dbId = project.id
  if (dbId === "6b531bc0f091468a864e8ce334818331") {
    database_detail = "Reputation System"
  } else if (dbId === "e4cb2289279e4d788f278f54709afed0") {
    database_detail = "Member NFT"
  }

  // const database_detail_name = database_detail.results.map(item => {
  //   let name = ""
  //   if (item.id == project.id) {
  //     name = item.title.plain_text
  //   }
  //   return {
  //     ...name
  //   }
  // })

    const data = project;
    let total_skills = [];
    let uniqueSkills = ['Developer','Writer','Designer','Strategy']
    const notionData = data.results.map(item => {
      let result_list = {}
      result_list.id = item.id
      result_list.username = item.properties.Assignee.select.name
      result_list.points = item.properties.Points.number
  
      if (item.properties.Skill != undefined && item.properties.Skill.multi_select.length > 0) {
        let skill_list = []
        for (let i = 0; i < item.properties.Skill.multi_select.length; i++) {
          result_list[item.properties.Skill.multi_select[i].name] = item.properties.Points.number
          skill_list.push(item.properties.Skill.multi_select[i].name)
          total_skills.push(item.properties.Skill.multi_select[i].name)
        }
        result_list.skills = skill_list
      }
      result_list.total_points = item.properties.Points.number
      result_list.timestamp = item.last_edited_time
  
      return {
        ...result_list  
      }
    })
    // let uniqueSkills = [...new Set(total_skills)]
  
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