// export default async function getNotionDatabase () {
//     const { Client } = require('@notionhq/client');
//     // Fetch data from external API
//     const notion = new Client({ auth: '' });
//     const response = await notion.search({
//       query: 'External tasks',
//       sort: {
//         direction: 'ascending',
//         timestamp: 'last_edited_time',
//       },
//     });
//     const data = await response;
//     return data;
//   }
