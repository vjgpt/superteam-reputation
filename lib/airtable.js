const Airtable = require("airtable");
import { AIRTABLE_API_KEY, BASE } from "../config";

const getFilteredRecords = (records) => {
  // filter out the records where allocation is null and xp is not null
  return records.filter((record) => {
    return record.allocated !== null && record.xp !== null;
  }
  );
};

const getIndieRecordsFunction = async () => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE);
  const table = base('Indie Work');
  const data = [];
  await table
    .select({
      maxRecords: 1000,
      view: "Grid 3",
    })
    .eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {
          data.push({
            name: record.get('Claimer') || null,
            allocated: record.get('Allocated?') || null,
            xp: record.get('XP') || null,
            skill: record.get('Skill') || null,
          });
      });
      fetchNextPage();
  });

  return getFilteredRecords(data);
};

const getCommunityRecordsFunction = async () => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE);
  const table = base('Community');
  const data = [];
  const getCommunityRecords = await table
    .select({
      maxRecords: 1000,
      view: "Community",
    })
    .eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {
          data.push({
            claimer: record.get('Name') || null,
            xp_project: record.get('XP (Project)') || null,
            xp_non_project: record.get('XP (Non-Project)') || null,
            skill: record.get('Skill') || null,
          });
      });
      fetchNextPage();
  });

  const filteredData = data.filter((record) => {
    const xp = record.xp_project + record.xp_non_project;
    if (record.xp !== null && xp > 0) {
      return record;
    }
  });

  return filteredData;
};


const getProjectsWorkRecordsFunction = async () => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE);
  const table = base('Project Work');
  const data = [];
  const getProjectsRecords = await table
    .select({
      maxRecords: 1000,
      view: "XP Requests",
    })
    .eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {
          data.push({
            name: record.get('Contributor')[0] || null,
            project: record.get('Discord Handle') || null,
            allocated: record.get('Allocated?') || null,
            xp: record.get('Individual XP') || null,
            skill: record.get('Skill Name')[0] || null,
          });
      });
      fetchNextPage();
  });

  // filter out the records where allocation is null and xp is not null and reduce the data to only the fields by project
  const filteredData = getFilteredRecords(data).reduce((acc, record) => {
    if (acc[record.project]) {
      acc[record.project].push(record);
    }
    else {
      acc[record.project] = [record];
    }
    return acc;
  }, {});

  return filteredData;
};


const getProjectTitleFunction = async (id) => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE);
  const table = base('Projects');
  const getProjectTitle = await table
  .find(id)
  .then(record => {
    return record.get('Title');
  });

  return getProjectTitle;
};

export { getIndieRecordsFunction, getCommunityRecordsFunction, getProjectsWorkRecordsFunction, getProjectTitleFunction };