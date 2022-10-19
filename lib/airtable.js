const Airtable = require("airtable");

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
      view: "XP Requests",
    })
    .eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {
          data.push({
            name: record.get('Claimer') || null,
            allocated: record.get('Allocated?') || null,
            xp: record.get('XP Requested') || null,
            skill: record.get('Skill (from Skill)') ? record.get('Skill (from Skill)')[0] : null,
          });
      });
      fetchNextPage();
  });

  return getFilteredRecords(data);
};

const getBountiesRecordsFunction = async (req, res) => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE);
  const table = base('Bounties');
  const bounties = [];
  await table
    .select({
      maxRecords: 1000,
      view: "Grid view",
    })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          const fields = record.fields;
          const name = fields['Name'];
          const design = fields["Design Bounty XP"] || 0;
          const dev = fields["Development Bounty XP"] || 0;
          const writing = fields["Writing Bounty XP"] || 0;
          const video = fields["Video Bounty XP"] || 0;

          if (design > 0) {
            bounties.push({
              name: name || null,
              allocated: true,
              xp: design || null,
              skill: "Design",
            });

          } else if (dev) {
            bounties.push({
              name: name || null,
              allocated: true,
              xp: dev || null,
              skill: "Development",
            });
          } else if (writing) {
            bounties.push({
              name: name || null,
              allocated: true,
              xp: writing || null,
              skill: "Writing",
            });
          } else if (video) {
            bounties.push({
              name: name || null,
              xp: video || null,
              skill: 'Videography',
              allocated: true
            });
          }
      });
      fetchNextPage();
  });

  return bounties;
};

const getBrainTrustRecordsFunction = async () => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BRAIN_TRUST_BASE);
  const table = base('Recurring Team XP');
  const data = [];
  await table
    .select({
      maxRecords: 1000,
      view: "All",
    })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          data.push({
            name: record.get('Name (from Member)') ?  record.get('Name (from Member)')[0] : null,
            xp: record.get('XP')[0] || null,
            skill: record.get('Skill Category') || null,
            allocated: true
          });
      });
      fetchNextPage();
  });

  // const table2 = base('Team');
  // const data2 = [];
  // await table2
  //   .select({
  //     maxRecords: 1000,
  //     view: "Relevant",
  //   })
  //   .eachPage(function page(records, fetchNextPage) {
  //     records.forEach(function(record) {
  //         data2.push({
  //           name: record.get('Name') || null,
  //           xp: record.get('XP') || null,
  //           skill: 'Strategy',
  //           allocated: true
  //         });
  //     });
  //     fetchNextPage();
  // });
  
  // // concat the two tables
  // const data3 = data.concat(data2);
  
  // return data3;
  return data;
};

const getCommunityRecordsFunction = async () => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE);
  const table = base('Community');
  const data = [];
  await table
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
  await table
    .select({
      maxRecords: 1000,
      view: "All XP Requests",
    })
    .eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {
          data.push({
            name: record.get('Contributor')[0] || null,
            project: record.get('Discord Handle') || null,
            allocated: record.get('Allocated?') || null,
            xp: record.get('Individual XP') || null,
            skill: record.get('Skill (from Skill)') ? record.get('Skill (from Skill)')[0] : null,
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
  await table
    .select({
      maxRecords: 1000,
      view: "Grid view",
    })
    .eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {
          data.push({
            name: record.get('Name (from Member)')[0] || null,
            cab: record.get('Name (from Team)')[0] || null,
            xp: record.get('Total XP') || null,
            skill: record.get('Skill (from Skillset)') || null,
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

const getStackXpRecordsFunction = async (req, res) => {
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE);
  const table = base('Superteam StackEx XP');
  const data = [];
  await table
    .select({
      maxRecords: 1000,
      view: "Grid view",
    })
    .eachPage(function page(records, fetchNextPage) {

      records.forEach(function(record) {
          data.push({
            name: record.get('Discord') || null,
            xp: record.get('CumulativeXP') || null,
            skill: 'Development',
            allocated: true
          });
      });
      fetchNextPage();
  });

  return getFilteredRecords(data);
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
  getBountiesRecordsFunction, getCabsRecordsFunction,
  getBrainTrustRecordsFunction, getStackXpRecordsFunction };