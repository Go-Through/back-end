const axios = require('axios');
const fs = require('fs');

const url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService';
const dataResult = JSON.parse(fs.readFileSync('../service-key.json', 'utf8'));
const baseParams = {
  params: {
    ServiceKey: dataResult.key,
    numOfRows: '100',
    pageNo: '1',
    MobileOS: 'ETC',
    MobileApp: 'AppTest',
    _type: 'json',
  },
};

async function getFullLocation() {
  const service = 'areaCode';
  const areaFirsts = [];
  const areas = [];

  let axiosResult;
  let resultItem;
  axiosResult = await axios.get(`${url}/${service}`, baseParams);

  if (axiosResult.data.response.header.resultCode === '0000') {
    resultItem = axiosResult.data.response.body.items.item;
    for (const item of resultItem) {
      areaFirsts.push(item);
    }
    console.log(areaFirsts);
  }

  for (const area of areaFirsts) {
    baseParams.params.areaCode = area.code;
    axiosResult = await axios.get(`${url}/${service}`, baseParams);
    if (axiosResult.data.response.header.resultCode === '0000') {
      resultItem = axiosResult.data.response.body.items.item;
      const info = {};
      info[area.name] = resultItem;
      areas.push(info);
      console.log(info);
    } else {
      console.log(`axios Problem - ${axiosResult.data.response.header}`);
    }
  }
}

getFullLocation().then();
