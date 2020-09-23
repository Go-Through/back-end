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

function changeToFrontName(testIdx, str) {
  if (testIdx === 0) {
    switch (str) {
      case '서울':
        str = '서울특별시';
        break;
      case '인천':
        str = '인천광역시';
        break;
      case '대전':
        str = '대전광역시';
        break;
      case '대구':
        str = '대구광역시';
        break;
      case '광주':
        str = '광주광역시';
        break;
      case '울산':
        str = '울산광역시';
        break;
      case '세종특별자치시':
        str = '세종특별시';
        break;
      case '부산':
        str = '부산광역시';
        break;
      default:
        break;
    }
  } else if (testIdx === 1) {
    switch (str) {
      case '해수욕장':
        str = '바다';
        break;
      case '체험관광지':
        str = '체험';
        break
      case '미술관/화랑':
        str = '미술관';
        break;
      case '레포츠':
        str = '액티비티';
        break;
      case '역사관광지':
        str = '역사';
        break;
      default:
        break;
    }
  }
  return str;
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
  if (req.session.passport && req.session.passport.user) {
    next();
  } else {
    res.status(301).redirect('/');
  }
};

function isIdValidate(id) {
  return id.length !== 0;
}

function isPasswordValidate(pw) {
  if (pw.length === 0) {
    return false;
  }
  const regPwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 6 ~ 20 글자수의 영문, 숫자 판별 정규식
  return regPwd.test(pw);
}

function itemsToResult(result, tripResult) {
  if (Array.isArray(result.items.item)) {
    for (const content of result.items.item) {
      // 여행 코스 컨텐츠는 추가 안함.
      if (content.contenttypeid !== 25) {
        const tempItem = {};
        tempItem.contentID = content.contentid;
        tempItem.contentTypeID = content.contenttypeid;
        tempItem.title = content.title;
        tempItem.address = content.addr1;
        tempItem.image = content.firstimage;
        tripResult.items.push(tempItem);
      }
    }
  } else {
    if (result.items !== '') {
      const content = result.items.item;
      if (content.contenttypeid !== 25) {
        const tempItem = {};
        tempItem.contentID = content.contentid;
        tempItem.contentTypeID = content.contenttypeid;
        tempItem.title = content.title;
        tempItem.address = content.addr1;
        tempItem.image = content.firstimage;
        tripResult.items.push(tempItem);
      }
    }
  }
}

function sortItems(sortOption, tripResult) {
  let option = '';
  switch (sortOption) {
    case 0:
      option = 'place_count';
      break;
    case 1:
      option = 'place_heart';
      break;
    case 2:
      option = 'title';
      break;
    default:
      option = 'place_count';
      break;
  }
  if (sortOption === 2) {
    // eslint-disable-next-line max-len
    tripResult.items.sort((a, b) => (a[option] < b[option] ? -1 : a[option] > b[option] ? 1 : 0));
  } else {
    // eslint-disable-next-line max-len
    tripResult.items.sort((a, b) => (a[option] > b[option] ? -1 : a[option] < b[option] ? 1 : 0));
  }
}

// 하트 누른건지 아닌지 확인하는 함수
async function checkBasket(userInfo, contentId) {
  let result = false;
  try {
    if (userInfo.basketPlaces) {
      const userBasketInfo = userInfo.basketPlaces;
      // null 이 아니면
      if (userBasketInfo && userBasketInfo.basketItems) {
        // basketItems: [content id] 들어갈 예정
        const basketResult = userBasketInfo.basketItems;
        for (const basketId of basketResult) {
          if (basketId === contentId) {
            result = true;
            break;
          }
        }
      }
    }
  } catch (err) {
    console.error('checkBasket() error');
    console.error(err.message);
    throw err;
  }
  return result;
}

async function checkPlaceInfo(userInfo, tripResult) {
  const resultContentID = [];
  for (const tripInfo of tripResult.items) {
    resultContentID.push(tripInfo.contentID);
  }
  const placeInfoArr = {};
  try {
    const sqlResultSet = await models.places.findAll({
      where: { contentID: resultContentID },
    });
    for (const sqlResult of sqlResultSet) {
      const sqlInfo = sqlResult.get();
      placeInfoArr[sqlInfo.contentID] = sqlResult.get();
    }
  } catch (err) {
    console.error('checkPlaceInfo() error');
    console.error(err.message);
    throw err;
  }
  for (const tripInfo of tripResult.items) {
    const contentId = tripInfo.contentID;
    if (placeInfoArr.hasOwnProperty(contentId)) {
      const placeInfo = placeInfoArr[contentId];
      tripInfo.contentTypeID = placeInfo.contentTypeID;
      tripInfo.title = placeInfo.placeTitle;
      tripInfo.address = placeInfo.address;
      tripInfo.image = placeInfo.image;
      tripInfo.placeCount = placeInfo.placeCount;
      tripInfo.placeHeart = placeInfo.placeHeart;
    } else {
      tripInfo.placeCount = 0;
      tripInfo.placeHeart = 0;
    }
    if (userInfo) {
      tripInfo.heartFlag = await checkBasket(userInfo, contentId);
    } else {
      tripInfo.heartFlag = false;
    }
  }
}

module.exports = {
  axios,
  models,
  baseParams,
  callService,
  changeToTourName,
  changeToFrontName,
  findIncludeName,
  connectDB,
  authenticateUser,
  isIdValidate,
  isPasswordValidate,
  itemsToResult,
  sortItems,
  checkBasket,
  checkPlaceInfo,
};
