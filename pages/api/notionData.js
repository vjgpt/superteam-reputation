export default async function getNotionData (id ,filterCondition) {
    const { Client } = require('@notionhq/client');
    // Fetch data from external API
    const notion_key = process.env.NOTION_API_KEY;
    const notion = new Client({ auth: notion_key });  
    const response = await notion.databases.query({
      database_id: id,
      filter: filterCondition,
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