const axios = require('axios');
const fs = require('fs');
const models = require('../models');

const url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService';
const dataResult = JSON.parse(fs.readFileSync(`${__dirname}/../service-key.json`, 'utf8'));

const baseParams = {
  params: {
    ServiceKey: dataResult.key,
    numOfRows: '100',
    pageNo: '1',
    MobileOS: 'ETC',
    MobileApp: 'KN-Trip',
    _type: 'json',
  },
};

async function callService(service, params) {
  let resultItem;
  try {
    const axiosResult = await axios.get(`${url}/${service}`, params);
    if (axiosResult.data.response.header.resultCode === '0000') {
      resultItem = axiosResult.data.response.body.items.item;
    } else {
      console.log(axiosResult.data.response.header);
      resultItem = null;
    }
  } catch (err) {
    console.error('callService() error');
    console.error(err.message);
    return null;
  }
  return resultItem;
}

async function connectDB() {
  try {
    await models.sequelize.sync();
    console.log('DB 연결 성공');
    return true;
  } catch (err) {
    console.error('connectDB() error');
    throw err;
  }
}
connectDB().then(console.log);

module.exports = {
  axios,
  models,
  baseParams,
  callService,
};
