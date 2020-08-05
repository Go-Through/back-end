const { callService, baseParams, models } = require('./init-module');
const { getTest } = require('./manage-test');

async function getMyPlace(userId, pos, order, numOfRow) {
  try {
    const testResult = await getTest(userId);
    let coupleResult;
    if (testResult.with !== null) {
      coupleResult = await getTest(testResult.with);
    } else {
      coupleResult = null;
    }
  } catch (err) {
    console.error('getMyPlace() error');
    console.error(err.message);
    throw err;
  }
}

async function getTripInfo(contentId){
}

module.exports = {
  getMyPlace,
  getTripInfo,
};
