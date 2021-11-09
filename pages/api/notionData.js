export default async function getNotionData (id) {
    const { Client } = require('@notionhq/client');
    // Fetch data from external API
    const notion = new Client({ auth: 'secret_PcEOXPFmwMHxcXtaBFWX0hisC4xIpLEbdm1ZV1D7nP7' });
    const response = await notion.databases.query({
      database_id: id,
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
    const data = await response;
    return data;
  }


// export function sumGroupByName (data) {
//     let total_skills = [];
//     const notionData = data.results.map(item => {
//       let result_list = {}
//       result_list.id = item.id
//       result_list.username = item.properties.Engineers.select.name
//       result_list.points = item.properties.Points.rich_text[0].plain_text.slice(0, -2)
  
//       if (item.properties.Skills != undefined && item.properties.Skills.multi_select.length > 0) {
//         let skill_list = []
//         for (let i = 0; i < item.properties.Skills.multi_select.length; i++) {
//           result_list[item.properties.Skills.multi_select[i].name] = item.properties.Points.rich_text[0].plain_text.slice(0, -2)
//           skill_list.push(item.properties.Skills.multi_select[i].name)
//           total_skills.push(item.properties.Skills.multi_select[i].name)
//         }
//         result_list.skills = skill_list
//       }
//       result_list.total_points = item.properties.Points.rich_text[0].plain_text.slice(0, -2)
//       result_list.timestamp = item.last_edited_time
  
//       return {
//         ...result_list  
//       }
//     })
//     let uniqueSkills = [...new Set(total_skills)]
  
//     const data_list = notionData.map(item => {
//       let data = []
//       const header =  Object.keys(item)
//       let difference = uniqueSkills.filter(x => !header.includes(x));
//       for (let i = 0; i < difference.length; i++) {
//         data[difference[i]] = 0
//       }
//       return {
//         ...item,
//         ...data
//       }
//     })
  
//     const groupedData = data_list.reduce((acc, item) => {
//       const { id, username, total_points, timestamp } = item
//       const key = username
//       const value = {
//         ...item,
//         timestamp
//       }
//       if (!acc[key]) {
//         acc[key] = [value]
//       } else {
//         acc[key].push(value)
//       }
//       return acc
//     }, {})
  
//     const sumGroupedData = Object.keys(groupedData).map(key => {
//       const values = groupedData[key]
//       const skill_points = {}
//       for (let i = 0; i < values.length; i++) {
//         for (let j = 0; j < uniqueSkills.length; j++) {
//           if (values[i][uniqueSkills[j]] != undefined) {
//             if (skill_points[uniqueSkills[j]] == undefined) {
//               skill_points[uniqueSkills[j]] = parseInt(values[i][uniqueSkills[j]])
//             } else {
//               skill_points[uniqueSkills[j]] += parseInt(values[i][uniqueSkills[j]])
//             }
//           }
//         }
//       }
//       console.log(skill_points)
  
//       return {
//         id: key,
//         ...skill_points,
//         total_points: values.reduce((acc, item) => acc + parseInt(item.total_points), 0),
//         timestamp: values[0].timestamp
//       }
//     })

//   return sumGroupedData;
// }