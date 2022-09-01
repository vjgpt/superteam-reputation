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
            xp: record.get('XP Requested') || null,
            skill: record.get('Skill') || null,
          });
      });
      fetchNextPage();
  });

  return getFilteredRecords(data);
};

const getBountiesRecordsFunction = async (req, res) => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BOUNTY_BASE);
  const table = base('Writing Bounty Leaderboard');
  const writingBountyData = [];
  await table
    .select({
      maxRecords: 1000,
      view: "Grid view",
    })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          writingBountyData.push({
            name: record.get('Name (from Names)')[0] || null,
            xp: record.get('XP') || null,
            skill: 'Writing',
            allocated: true
          });
      });
      fetchNextPage();
  });

  const table2 = base('Videography Bounty Leaderboard');
  const videographyBountyData = [];
  await table2
    .select({
      maxRecords: 1000,
      view: "Grid view",
    })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          videographyBountyData.push({
            name: record.get('Name (from Notes)')[0] || null,
            xp: record.get('XP') || null,
            skill: 'Videography',
            allocated: true
          });
      });
      fetchNextPage();
  });

  const table3 = base('Design Bounty');
  const designBountyData = [];
  await table3
    .select({
      maxRecords: 1000,
      view: "Grid view",
    })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          designBountyData.push({
            name: record.get('Final Name') || null,
            xp: record.get('Total') || null,
            skill: 'Design',
            allocated: true
          });
      });
      fetchNextPage();
  });

  // combine the data from the three tables
  const data = writingBountyData.concat(videographyBountyData, designBountyData);

  return data;
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

const getCabsRecordsFunction = async (req, res) => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE);
  const table = base('CAB/SubDAO XPs');
  const data = [];
  const getCabsRecords = await table
    .select({
      maxRecords: 1000,
      view: "Grid view",
    })
    .eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {
          data.push({
            name: record.get('Name (from Member)')[0] || null,
            cab: record.get('Name')[0] || null,
            xp: record.get('Total XP') || null,
            skill: record.get('Skillset') || null,
            allocated: true
          });
      });
      fetchNextPage();
  });

  const filteredData = getFilteredRecords(data).reduce((acc, record) => {
    if (acc[record.cab]) {
      acc[record.cab].push(record);
    }
    else {
      acc[record.cab] = [record];
    }
    return acc;
  }, {});

  return filteredData;
}

const getAllTitleFunction = async () => {
  const cabs = await getCabsRecordsFunction();
  const projects = await getProjectsWorkRecordsFunction();

  // store the objects in an array
  const cabsArray = Object.keys(cabs);
  const projectsArray = Object.keys(projects);

  return {
    cabs: cabsArray,
    projects: projectsArray
  }
};

export { getIndieRecordsFunction, getCommunityRecordsFunction, 
  getProjectsWorkRecordsFunction, getAllTitleFunction,
  getBountiesRecordsFunction, getCabsRecordsFunction };