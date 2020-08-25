const { callService, baseParams, models } = require('./init-module');

async function checkBasket(userId, contentId) {
  let result = false;
  try {
    const sqlResult = await models.users.findOne({
      where: {
        id: userId,
      },
      attributes: ['basket_places'],
    });
    if (sqlResult) {
      const userBasketInfo = sqlResult.get();
      // null 이 아니면
      if (userBasketInfo.basket_places && userBasketInfo.basket_places.basketItems) {
        // basketItems: [content id] 들어갈 예정
        const basketResult = userBasketInfo.basket_places.basketItems;
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

// 세부 정보 조회 페이지에서 호출, 세부 정보 조회 시 조회 수 올라가고 최근 조회한 여행지에 추가.
async function getCommonInfo(userId, contentId, contentTypeId){
  const result = {};
  const tx = await models.sequelize.transaction();
  try {
    let sqlResult;
    const promises = [];
    const contentParams = JSON.parse(JSON.stringify(baseParams));
    contentParams.params.numOfRows = 1;
    contentParams.params.contentId = contentId;
    contentParams.params.contentTypeId = contentTypeId;
    promises.push(callService('detailIntro', contentParams));
    const commonParams = JSON.parse(JSON.stringify(contentParams));
    commonParams.params.defaultYN = 'Y';
    commonParams.params.firstImageYN = 'Y';
    commonParams.params.addrinfoYN = 'Y';
    commonParams.params.areacodeYN = 'Y';
    commonParams.params.mapinfoYN = 'Y';
    commonParams.params.overviewYN = 'Y';
    promises.push(callService('detailCommon', commonParams));
    const commonResult = await Promise.all(promises);
    for (const resultItem of commonResult) {
      const info = resultItem.items.item;
      if (info.hasOwnProperty('addr1')) { // Common
        sqlResult = await models.tourArea.findOne({
          where: {
            areaCode: info.areacode,
            sigunguCode: info.sigungucode,
          },
          attributes: ['area_name', 'sigungu_name'],
        });
        if (sqlResult) {
          const areaInfo = sqlResult.get();
          result.area = `${areaInfo.area_name} ${areaInfo.sigungu_name}`;
        }
        result.title = info.title;
        result.address = `${info.addr1}\n${info.addr2}`;
        result.heart = false;
        const basketChkResult = await checkBasket(userId, info.contentid);
        if (basketChkResult) {
          result.heart = true;
        }
        result.introStr = info.overview;
        result.mapx = info.mapx;
        result.mapy = info.mapy;
        result.homepage = info.homepage;
        result.firstimage = info.firstimage;
        result.firstimage2 = info.firstimage2;
      } else if (info.hasOwnProperty('usefee')) { // Intro
        result.babycarriageRent = info.chkbabycarriageculture;
        result.creditcardAvailable = info.chkcreditcardculture;
        result.petAvailable = info.chkpetculture;
        result.infocenterNumber = info.infocenterculture;
        result.parkingInfo = info.parkingculture;
        result.parkingFee = info.parkingfee;
        result.restDateInfo = info.restdateculture;
        result.spendTime = info.spendtime;
        result.useFee = info.usefee;
        result.usetimeInfo = info.usetimeculture;
      }
    }
    // user search place 가져오기
    sqlResult = await models.users.findOne({
      where: {
        id: userId,
      },
      attributes: ['search_places'],
    });
    if (sqlResult) {
      // searchPlace도 마찬가지로 searchItems: [contentId ] 들어갈 예정
      const userSearch = sqlResult.get();
      const newItems = [];
      if (userSearch.searchPlaces && userSearch.searchPlaces.searchItems) {
        for (const searchId of userSearch.searchPlaces.searchItems) {
          if (searchId !== contentId) {
            newItems.push(searchId);
          }
        }
      }
      const newLength = newItems.unshift(contentId);
      if (newLength > 30) {
        newItems.pop();
      }
      // user 조회 업데이트, place count 업데이트
      await models.users.update({
        searchPlaces: { searchItems: newItems },
      }, {
        where: { id: userId },
        transaction: tx,
      });
      sqlResult = await models.places.findOrCreate({
        where: {
          contentID: contentId,
        },
        transaction: tx,
        defaults: {
          contentID: contentId,
          contentTypeID: contentTypeId,
          placeTitle: result.title,
          placeCount: 1,
          placeHeart: 0,
        },
      });
      const placeInfo = sqlResult[0];
      const created = sqlResult[1];
      // 이미 create 된 거면
      if (!created) {
        await models.places.update({
          placeCount: (placeInfo.get()).placeCount + 1,
        }, {
          where: { contentID: contentId },
          transaction: tx,
        });
      }
    }
    await tx.commit();
  } catch (err) {
    if (tx) {
      await tx.rollback();
    }
    console.error('getCommonInfo() error');
    console.error(err.message);
    throw err;
  }
  return result;
}

module.exports = {
  checkBasket,
  getCommonInfo,
};
