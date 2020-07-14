const axios = require('axios');
const fs = require('fs');
const util = require('util');

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

const contentTypeIds = [
  { id: 12, name: '관광지' },
  { id: 14, name: '문화시설' },
  { id: 15, name: '행사/공연/축제' },
  { id: 25, name: '여행코스' },
  { id: 28, name: '레포츠' },
  { id: 32, name: '숙박' },
  { id: 38, name: '쇼핑' },
  { id: 39, name: '음식' },
];

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
    console.error(err.message);
    resultItem = null;
  }
  return resultItem;
}

async function callFullLocation() {
  const service = 'areaCode';
  const areaParams = JSON.parse(JSON.stringify(baseParams));
  const areaFirsts = [];
  const areas = [];

  let resultItem;
  resultItem = await callService(service, areaParams);
  if (resultItem) {
    for (const item of resultItem) {
      areaFirsts.push(item);
    }
  } else {
    console.log('axios error');
    return null;
  }

  for (const area of areaFirsts) {
    areaParams.params.areaCode = area.code;
    resultItem = await callService(service, areaParams);
    if (resultItem) {
      const info = {};
      info.areaCode = area.code;
      info.areaName = area.name;
      info.sigungu = resultItem;
      areas.push(info);
    } else {
      console.log('axios error');
      return null;
    }
  }
  return areas;
}
/* callFullLocation().then((result) => {
  console.log(util.inspect(result, false, null, true));
}); */

async function callFullCategory(categoryParams) {
  const service = 'categoryCode';
  const firstCats = [];
  const secondCats = [];
  const fullCats = [];
  let info = {};

  let resultItem;
  resultItem = await callService(service, categoryParams);
  if (resultItem) {
    if (Array.isArray(resultItem)) {
      for (const item of resultItem) {
        firstCats.push(item);
      }
    } else {
      firstCats.push(resultItem);
    }
  } else {
    console.log('Axios Error');
    return null;
  }

  for (const cat of firstCats) {
    categoryParams.params.cat1 = cat.code;
    resultItem = await callService(service, categoryParams);
    if (resultItem) {
      info = {};
      info.cat1 = cat.code;
      info.name1 = cat.name;
      info.cat2 = [];
      if (Array.isArray(resultItem)) {
        for (const item of resultItem) {
          info.cat2.push(item);
        }
      } else {
        info.cat2.push(resultItem);
      }
      secondCats.push(info);
    } else {
      console.log('Axios Error');
      return null;
    }
  }

  for (const sCat of secondCats) {
    categoryParams.params.cat1 = sCat.cat1;
    for (const ssCat of sCat.cat2) {
      categoryParams.params.cat2 = ssCat.code;
      resultItem = await callService(service, categoryParams);
      if (resultItem) {
        info = {};
        info.cat1 = sCat.cat1;
        info.name1 = sCat.name1;
        info.cat2 = ssCat.code;
        info.name2 = ssCat.name;
        info.cat3 = resultItem;
        fullCats.push(info);
      } else {
        console.log('Axios Error');
        return null;
      }
    }
  }
  return fullCats;
}

async function contentAllCategory(contentArr) {
  const allContentCats = [];
  for (const content of contentArr) {
    const categoryParams = JSON.parse(JSON.stringify(baseParams));
    categoryParams.params.contentTypeId = content.id;
    const info = {};
    info.contentId = content.id;
    info.contentName = content.name;
    info.categorys = await callFullCategory(categoryParams);
    allContentCats.push(info);
  }
  return allContentCats;
}
/* contentAllCategory(contentTypeIds).then((result) => {
  console.log(util.inspect(result, false, null, true));
}); */

module.exports = {
};
