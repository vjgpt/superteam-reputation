export default async function getNotionDatabase () {
    const { Client } = require('@notionhq/client');
    // Fetch data from external API
    const notion = new Client({ auth: 'secret_PcEOXPFmwMHxcXtaBFWX0hisC4xIpLEbdm1ZV1D7nP7' });
    const response = await notion.search({
      query: 'External tasks',
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time',
      },
    });
    const data = await response;
    return data;
  }
