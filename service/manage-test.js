const { models, changeToTourName, findIncludeName, changeToFrontName } = require('./init-module');

// Test 등록하는 함수 - 유저 정보에도 입력하고, place 의 경우 도시 테이블에도 결과 반영해줘야한다.
async function enrollTest(userIdx, testObject) {
  const placeArr = testObject.place;
  const conceptArr = testObject.concept;
  const tourPlaceArr = changeToTourName(0, placeArr);
  const tourConceptArr = changeToTourName(1, conceptArr);
  const tx = await models.sequelize.transaction();
  try {
    // Tour API 형식에 맞게 등록해주기
    const areaList = [];
    const categoryList = [];
    let promises = [];
    for (const placeName of tourPlaceArr) {
      promises.push(findIncludeName(areaList, 'tourArea', placeName));
    }
    await Promise.all(promises);
    promises = [];
    for (const conceptName of tourConceptArr) {
      promises.push(findIncludeName(categoryList, 'tourCategory', conceptName));
    }
    await Promise.all(promises);
    const areaIds = [];
    const categoryIds = [];
    areaList.forEach((item) => {
      if (item === 0) {
        areaIds.push(0);
      } else {
        areaIds.push(item.id);
      }
    });
    categoryList.forEach((item) => {
      if (item === 0) {
        categoryIds.push(0);
      } else {
        categoryIds.push(item.id);
      }
    });
    // 테스트 등록
    let sqlResult;
    sqlResult = await models.tests.create({
      likePlaces: {
        areaIDs: areaIds,
      },
      likeContents: {
        categoryIDs: categoryIds,
      },
    }, { transaction: tx });
    const testId = (sqlResult.get()).id;
    // 유저 등록
    sqlResult = await models.users.update({
      testIdx: testId,
      userPlaces: null,
    }, {
      where: { id: userIdx },
      transaction: tx,
    });
    // 도시 등록
    for (const areaItem of areaList) {
      if (areaItem === 0) {
        break;
      } else {
        sqlResult = await models.citys.findOrCreate({
          where: {
            areaIndex: areaItem.id,
          },
          transaction: tx,
          defaults: {
            cityName: areaItem.area_name,
          },
        });
        if (!sqlResult[1]) {
          await models.citys.update({
            cityCount: sqlResult[0].dataValues.cityCount += 1,
          }, {
            where: { areaIndex: areaItem.id },
            transaction: tx,
          });
        }
      }
    }
    await tx.commit();
  } catch (err) {
    if (tx) {
      await tx.rollback();
    }
    console.error('enrollTest() error');
    console.error(err.message);
    throw err;
  }
  return 'success';
}

// DB상 저장되어 있는 정보 가져와서, Tour API Call 형식으로 가져와줌.
async function getTest(userId) {
  const result = {};
  try {
    let sqlResult = await models.users.findOne({
      where: {
        id: userId,
      },
      attributes: ['test_idx', 'with_id'],
    });
    const userInfo = sqlResult.get();
    const testId = userInfo.test_idx;
    result.with = userInfo.with_id;
    // 테스트 정보 없으면 여행지 정보 쓸 수 없음.
    if (testId === null) {
      return null;
    }
    sqlResult = await models.tests.findOne({
      where: {
        id: testId,
      },
      attributes: ['like_places', 'like_contents'],
    });
    const testInfo = sqlResult.get();
    const likeAreaIds = testInfo.like_places.areaIDs;
    const likeCategoryIds = testInfo.like_contents.categoryIDs;
    let sqlResultSet;
    const areaInfo = [];
    const categoryInfo = [];
    if (likeAreaIds.includes(0)) {
      areaInfo.push(0);
    } else {
      sqlResultSet = await models.tourArea.findAll({
        where: {
          id: likeAreaIds,
        },
        attributes: ['id', 'area_code', 'area_name'],
      });
      for (sqlResult of sqlResultSet) {
        areaInfo.push(sqlResult.get());
      }
    }
    if (likeCategoryIds.includes(0)) {
      categoryInfo.push(0);
    } else {
      sqlResultSet = await models.tourCategory.findAll({
        where: {
          id: likeCategoryIds,
        },
        attributes: ['id', 'category_code', 'category_name'],
      });
      for (sqlResult of sqlResultSet) {
        categoryInfo.push(sqlResult.get());
      }
    }
    result.area = areaInfo;
    result.category = categoryInfo;
  } catch (err) {
    console.error('getTest() error');
    console.error(err.message);
    throw err;
  }
  return result;
}

function reFormatResult(testResult, coupleResult, attribute) {
  const totalResult = {};
  let intersection;

  if (testResult[attribute].includes(0)) { // 나는 전체 선택했을 경우
    if (coupleResult[attribute].includes(0)) { // 커플은 전체 선택했을 경우
      totalResult[attribute] = [0];
    } else { // 커플은 전체 선택 안했을 경우
      totalResult[attribute] = coupleResult[attribute];
    }
  } else { // 나는 전체 선택 안했을 경우
    if (coupleResult[attribute].includes(0)) { // 커플은 전체 선택했을 경우
      totalResult[attribute] = testResult[attribute];
    } else { // 둘 다 전체 선택 안했을 경우
      const idList = [[], []];
      for (const myInfo of testResult[attribute]) {
        idList[0].push(myInfo.id);
      }
      for (const coupleInfo of coupleResult[attribute]) {
        idList[1].push(coupleInfo.id);
      }
      intersection = idList[0].filter((x) => idList[1].includes(x));
      for (const myInfo of testResult[attribute]) {
        if ((intersection.includes(myInfo.id)) && (!(totalResult[attribute].includes(myInfo.id)))) {
          totalResult[attribute].push(myInfo);
        }
      }
      for (const coupleInfo of coupleResult[attribute]) {
        // eslint-disable-next-line max-len
        if ((intersection.includes(coupleInfo.id)) && (!(totalResult[attribute].includes(coupleInfo.id)))) {
          totalResult[attribute].push(coupleInfo);
        }
      }
    }
  }
  return totalResult;
}

async function getTotalTest(userId) {
  const testResult = await getTest(userId);
  if (!testResult) return null;
  let coupleResult;
  if (testResult.with !== null) {
    coupleResult = await getTest(testResult.with);
  } else {
    coupleResult = null;
  }
  const totalResult = {};
  // 커플이 등록되어 있는데 테스트를 안했거나, 커플이 등록 안되어있거나
  if (coupleResult === null) {
    totalResult.area = testResult.area; // [id, areaCode, areaName]
    totalResult.category = testResult.category; // [id, categoryCode, categoryName]
  } else { // 커플 등록되어 있는데 테스트도 한 경우
    totalResult.area = (reFormatResult(testResult, coupleResult, 'area', totalResult)).area;
    totalResult.category = (reFormatResult(testResult, coupleResult, 'category', totalResult)).category;
  }
  totalResult.message = 'OK';
  return totalResult;
}

async function getTotalHashtag(userId) {
  const totalResult = await getTotalTest(userId);
  if (!totalResult) return null;
  const areaArr = totalResult.area;
  const categoryArr = totalResult.category;
  for (let areaInfo of areaArr) {
    if (areaInfo === 0) {
      areaInfo = { area_name: '아무데나' };
    } else {
      areaInfo.area_name = changeToFrontName(0, areaInfo.area_name);
    }
  }
  for (let categoryInfo of categoryArr) {
    if (categoryInfo === 0) {
      categoryInfo = { category_name: '전체' };
    } else {
      categoryInfo.category_name = changeToFrontName(1, categoryInfo.category_name);
    }
  }
  return totalResult;
}

module.exports = {
  enrollTest,
  getTotalTest,
  getTotalHashtag,
};
