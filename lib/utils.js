
// define a function to get the current page
function mergeAllXPData(projectData, indieData, cabsData, bountyData, btData) {

  var mergedData = [];

  for (var key in projectData) {
    const project = projectData[key];
    for (const projectValue in project) {
      const rep = project[projectValue];
      if (rep) {
        mergedData.push({
          name: rep.name,
          skill: rep.skill,
          xp: rep.xp || 0,
        });
      }
    }
  }

  for (var key in cabsData) {
    const cabs = cabsData[key];
    for (const cabsValue in cabs) {
      const rep = cabs[cabsValue];
      if (rep) {
        mergedData.push({
          name: rep.name,
          skill: rep.skill,
          xp: rep.xp || 0,
        });
      }
    }
  }

  for (var key in indieData) {
    const indie = indieData[key];
    if (indie && indie.name) {
      mergedData.push({
        name: indie.name,
        skill: indie.skill,
        xp: indie.xp || 0,
      });
    }
  }
  
  for (var key in bountyData) {
    const bounty = bountyData[key];
    if (bounty && bounty.name) {
      mergedData.push({
        name: bounty.name,
        skill: bounty.skill,
        xp: bounty.xp || 0,
      });
    }
  }

  for (var key in btData) {
    const bt = btData[key];
    if (bt && bt.name) {
      mergedData.push({
        name: bt.name,
        skill: bt.skill,
        xp: bt.xp || 0,
      });
    }
  }
  
  return mergedData;
}

function getLeaderboardData(projectData, indieData, cabsData, bountyData, btData) {

  const mergedData = mergeAllXPData(projectData, indieData, cabsData, bountyData, btData);

  const leaderboardData = [];

  // reduce the merged data to a leaderboard calculating each skill with the xp
  mergedData.reduce((acc, cur) => {
    const { name, skill, xp } = cur;
    const index = acc.findIndex((item) => item.name === name);
    if (index === -1) {
      acc.push({
        name,
        [skill]: xp || 0,
      });
    } else {
      acc[index][skill] = (acc[index][skill] || 0) + xp;
    }
    return acc;
  }, leaderboardData);

  // sort the leaderboard by the total xp
  leaderboardData.sort((a, b) => {
    const aTotal = Object.values(a).reduce((acc, cur) => {
      if (typeof cur === 'number') {
        return acc + cur;
      }
      return acc;
    }, 0);

    const bTotal = Object.values(b).reduce((acc, cur) => {
      if (typeof cur === 'number') {
        return acc + cur;
      }
      return acc;
    }, 0);

    return bTotal - aTotal;
  });

  return leaderboardData;
}

function transformLeaderboardData(leaderboardData) {

  // get the unique skills from the leaderboard data
  let skills = []
  leaderboardData.forEach(({ name, ...rest }) => {
    skills = [...skills, ...Object.keys(rest)]
  })
  skills = [...new Set(skills)];

  if (skills.includes('DAO Ops (incl. Brain Trust)')) {
    // rename the skill to Brain Trust
    skills = skills.map(skill => skill === 'DAO Ops (incl. Brain Trust)' ? 'Brain Trust' : skill)
  }

  // transform the leaderboard data to a table
    // make a new array of objects with the skills and the xp for each skill and a total xp
  const leaderboardDataWithSkills = leaderboardData.map(({ name, ...rest }) => {
    const newObject = { name }
    newObject.username = name
    delete newObject.name

    skills.forEach(skill => {
      // float to int for the xp
      newObject[skill] = Math.floor(rest[skill] || 0)

      // if the skill name is 'Brain Trust', add the xp from DAO Ops (incl. Brain Trust)
      if (skill === 'Brain Trust') {
        newObject[skill] += Math.floor(rest['DAO Ops (incl. Brain Trust)'] || 0)
      }
    }
    )
    newObject.total_points = Object.values(rest).reduce((acc, cur) => {
      if (typeof cur === 'number') {
        return Math.floor(acc) + Math.floor(cur);
      }
      return Math.floor(acc);
    }, 0)
    return newObject
  })

  return {
    skills,
    leaderboardDataWithSkills
  }
}


export { mergeAllXPData, getLeaderboardData, transformLeaderboardData };