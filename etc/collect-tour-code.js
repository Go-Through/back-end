const util = require('util');
const {
  models, baseParams, callService,
} = require('../service/init-module');

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

async function callFullLocation() {
  const service = 'areaCode';
  const areaParams = JSON.parse(JSON.stringify(baseParams));
  const areaFirsts = [];
  const areas = [];

  let resultItem;
  resultItem = await callService(service, areaParams); // result = 도, 시 code
  if (resultItem) {
    for (const item of resultItem) {
      areaFirsts.push(item);
    }
  } else {
    console.error('tour api areaCode error');
    return null;
  }

  for (const area of areaFirsts) {
    areaParams.params.areaCode = area.code;
    resultItem = await callService(service, areaParams);
    if (resultItem) {
      const info = {};
      info.areaCode = area.code;
      info.areaName = area.name;
      info.sigungu = [];
      if (Array.isArray(resultItem)) {
        info.sigungu = resultItem;
      } else {
        info.sigungu.push(resultItem);
      }
      areas.push(info);
    } else {
      console.error('tour api areaCode error');
      return null;
    }
  }
  return areas;
}

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
    console.error('tour api categoryCode error');
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
      console.error('tour api categoryCode error');
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
        info.cat3 = [];
        if (Array.isArray(resultItem)) {
          info.cat3 = resultItem;
        } else {
          info.cat3.push(resultItem);
        }
        fullCats.push(info);
      } else {
        console.error('tour api categoryCode Error');
        return null;
      }
    }
  }
  return fullCats;
}

async function callContentAllCategory(contentArr) {
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

async function createAndUpdateArea(areaInfo) {
  try {
    let sqlResult = await models.tourArea.findOne({
      where: areaInfo,
    });
    if (sqlResult) return false; // Not Change
    sqlResult = await models.tourArea.findOne({
      where: {
        areaCode: areaInfo.areaCode,
        sigunguCode: areaInfo.sigunguCode,
      },
    });
    if (sqlResult) { // 정보 있는데 명칭이 바뀐거면 update
      await models.tourArea.update(areaInfo, {
        where: {
          areaCode: areaInfo.areaCode,
          sigunguCode: areaInfo.sigunguCode,
        },
      });
    } else { // 정보가 없는 상태
      await models.tourArea.create(areaInfo);
    }
    return true;
  } catch (err) {
    console.error('findOrUpdateArea() error');
    console.error(err.message);
  }
}

async function createAndUpdateCategory(cCode, cName) {
  try {
    let sqlResult = await models.tourCategory.findOne({
      where: {
        categoryCode: cCode,
        categoryName: cName,
      },
    });
    if (sqlResult) return false; // Not Change
    sqlResult = await models.tourCategory.findOne({
      where: {
        categoryCode: cCode,
      },
    });
    if (sqlResult) { // 정보 있는데 명칭이 바뀐거면 update
      await models.tourCategory.update({
        categoryName: cName,
      }, {
        where: {
          categoryCode: cCode,
        },
      });
    } else { // 정보가 없는 상태
      await models.tourCategory.create({
        categoryCode: cCode,
        categoryName: cName,
      });
    }
    return true;
  } catch (err) {
    console.error('findOrCreateCategory() error');
    console.error(err.message);
    throw err;
  }
}

async function createOrUpdateContents(contentsInfo) {
  try {
    const sqlResult = await models.tourContent.findOne({
      where: {
        contentCode: contentsInfo.contentCode,
      },
    });
    if (!sqlResult) {
      await models.tourContent.create(contentsInfo);
    } else {
      await models.tourContent.update(contentsInfo, {
        where: {
          contentCode: contentsInfo.contentCode,
        },
      });
    }
    return true;
  } catch (err) {
    console.error('createOrUpdateContents() error');
    console.error(err.message);
    throw err;
  }
}

async function createTourInfo() {
  const areaResult = await callFullLocation();
  console.log(util.inspect(areaResult, false, null, true));
  const contentCategorys = await callContentAllCategory(contentTypeIds);
  console.log(util.inspect(contentCategorys, false, null, true));
  try {
    for (const areaInfo of areaResult) {
      await createAndUpdateArea({
        areaCode: areaInfo.areaCode,
        areaName: areaInfo.areaName,
        sigunguCode: null,
        sigunguName: null,
      });
      for (const sigunguInfo of areaInfo.sigungu) {
        await createAndUpdateArea({
          areaCode: areaInfo.areaCode,
          areaName: areaInfo.areaName,
          sigunguCode: sigunguInfo.code,
          sigunguName: sigunguInfo.name,
        });
      }
    }
    for (const contentInfo of contentCategorys) {
      const categoryInfo = {
        cat1: [],
        cat2: [],
        cat3: [],
      };
      const categorySet1 = new Set();
      const categorySet2 = new Set();
      const category3 = [];
      for (const category of contentInfo.categorys) {
        await createAndUpdateCategory(category.cat1, category.name1);
        categorySet1.add(category.cat1);
        await createAndUpdateCategory(category.cat2, category.name2);
        categorySet2.add(category.cat2);
        for (const item of category.cat3) {
          await createAndUpdateCategory(item.code, item.name);
          category3.push(item.code);
        }
      }
      categoryInfo.cat1 = Array.from(categorySet1);
      categoryInfo.cat2 = Array.from(categorySet2);
      categoryInfo.cat3 = category3;
      await createOrUpdateContents({
        contentCode: contentInfo.contentId,
        contentName: contentInfo.contentName,
        category: categoryInfo,
      });
    }
    return true;
  } catch (err) {
    console.error('createTourInfo() error');
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  createTourInfo,
};
