const { models, changeToTourName, findIncludeName } = require('./init-module');

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
            cityCount: (sqlResult.citys.get()).cityCount += 1,
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
  return 'Success';
}

// DB상 저장되어 있는 정보 가져와서, Tour API Call 형식으로 가져와줌. 또한 커플 ID가 있을 경우 적용시켜줌.
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
    if (testId === null) {
      return result;
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

module.exports = {
  enrollTest,
  getTest,
};
