export default async function getNotionData (id ,filterCondition, next_cursor) {
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
      start_cursor: next_cursor,
    });
    const data = await response;
    return data;
  }