
export default async function queryNotionData (id ,filterCondition) {
  const { Client } = require('@notionhq/client');
  // Fetch data from external API
  const notion = new Client({ auth: 'secret_PcEOXPFmwMHxcXtaBFWX0hisC4xIpLEbdm1ZV1D7nP7' });
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