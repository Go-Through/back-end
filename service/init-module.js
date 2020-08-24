const axios = require('axios');
const fs = require('fs');
const models = require('../models');

const url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService';
const dataResult = JSON.parse(fs.readFileSync(`${__dirname}/../service-key.json`, 'utf8'));

const baseParams = {
  params: {
    ServiceKey: dataResult.key,
    numOfRows: 100,
    pageNo: 1,
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
      resultItem = axiosResult.data.response.body;
    } else {
      console.log(axiosResult.data.response.header);
      resultItem = null;
    }
  } catch (err) {
    console.error('callService() error');
    console.error(err.message);
    throw err;
  }
  return resultItem;
}

// 프론트단에서 날라온 이름들을 Tour API 용으로 바꿔줌.
function changeToTourName(testIdx, testArr) {
  const result = [];
  if (testIdx === 0) {
    for (const locationName of testArr) {
      switch (locationName) {
        case '아무데나':
          result.push(0);
          break;
        case '서울특별시':
          result.push('서울');
          break;
        case '인천광역시':
          result.push('인천');
          break;
        case '대전광역시':
          result.push('대전');
          break;
        case '대구광역시':
          result.push('대구');
          break;
        case '광주광역시':
          result.push('광주');
          break;
        case '울산광역시':
          result.push('울산');
          break;
        case '세종특별시':
          result.push('세종특별자치시');
          break;
        case '부산광역시':
          result.push('부산');
          break;
        default:
          result.push(locationName);
          break;
      }
    }
  } else if (testIdx === 1) {
    for (const conceptName of testArr) {
      switch (conceptName) {
        case '전체':
          result.push(0);
          break;
        case '바다':
          result.push('해수욕장');
          break;
        case '체험':
          result.push('체험관광지');
          break;
        case '미술관':
          result.push('미술관/화랑');
          break;
        case '액티비티':
          result.push('레포츠');
          break;
        case '역사':
          result.push('역사관광지');
          break;
        default:
          result.push(conceptName);
          break;
      }
    }
  }
  return result;
}

// Tour API 명칭 중 name 포함하는 컨셉들이나 지역 반환
async function findIncludeName(result, tableName, name) {
  if (name === 0) {
    result.push(0);
    return true;
  }
  const { Op } = models.Sequelize;
  let statement;
  let sqlResultSet;
  try {
    if (tableName === 'tourArea') {
      statement = {
        where: {
          areaName: {
            [Op.like]: `%${name}%`,
          },
          sigunguCode: null,
          sigunguName: null,
        },
        attributes: ['id', 'area_name'],
      };
      sqlResultSet = await models.tourArea.findAll(statement);
    } else if (tableName === 'tourCategory') {
      statement = {
        where: {
          categoryName: name,
        },
      };
      sqlResultSet = await models.tourCategory.findOne(statement);
      // 같은 단어가 없을 시 단어를 포함하는 단어들을 찾는다.
      if (!sqlResultSet) {
        statement = {
          where: {
            categoryName: {
              [Op.like]: `%${name}%`,
            },
          },
          attributes: ['id'],
        };
        sqlResultSet = await models.tourCategory.findAll(statement);
      } else {
        result.push(sqlResultSet.get());
        return true;
      }
    }
    for (const sqlResult of sqlResultSet) {
      result.push(sqlResult.get());
    }
  } catch (err) {
    console.error('findIncludeName() error');
    console.error(err.message);
    throw err;
  }
  return true;
}

async function connectDB() {
  try {
    await models.sequelize.sync();
    console.log('DB 연결 성공');
  } catch (err) {
    console.error('connectDB() error');
    console.error(err.message);
    throw err;
  }
  return true;
}

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(301).redirect('/');
  }
};

module.exports = {
  axios,
  models,
  baseParams,
  callService,
  changeToTourName,
  findIncludeName,
  connectDB,
  authenticateUser,
};
