
// define a function to get the current page
function mergeProjectDataIndieData(projectData, indieData) {

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
  return mergedData;
}

function getLeaderboardData(projectData, indieData) {

  const mergedData = mergeProjectDataIndieData(projectData, indieData);

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

export { mergeProjectDataIndieData, getLeaderboardData };