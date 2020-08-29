const {
  callService, baseParams, checkPlaceInfo, itemsToResult,
} = require('./init-module');

function dropMyContent(contentId, totalResultItems) {
  const newItems = [];
  for (const item of totalResultItems) {
    if (item.contentID !== contentId) {
      newItems.push(item);
    }
  }
  return newItems;
}

async function recommendLocation(userInfo, locationX, locationY, contentId) {
  try {
    const recommendResult = {};
    recommendResult.items = [];
    const locationParams = JSON.parse(JSON.stringify(baseParams));
    locationParams.numOfRows = 15;
    locationParams.listYN = 'Y';
    // 대표 이미지가 반드시 있는 정렬, 거리순 가까운 것부터
    locationParams.arrange = 'S';
    locationParams.mapX = locationX;
    locationParams.mapY = locationY;
    locationParams.radius = 10000; // 단위 미터이기 때문에 10km
    const serviceResult = await callService('loactionBasedList', locationParams);
    itemsToResult(serviceResult, recommendResult);
    recommendResult.items = dropMyContent(contentId, recommendResult.items);
    await checkPlaceInfo(userInfo, recommendResult);
    return recommendResult.items;
  } catch (err) {
    console.error('recommendLocation() error');
    console.error(err.message);
    throw err;
  }
}

async function recommendArea(userInfo, areaCode, sigunguCode, contentId) {
  try {
    const recommendAreaResult = {};
    recommendAreaResult.items = [];
    const areaBasedParams = JSON.parse(JSON.stringify(baseParams));
    areaBasedParams.numOfRows = 15;
    areaBasedParams.listYN = 'Y';
    // 대표 이미지 있는 조회순 정렬
    areaBasedParams.arrange = 'P';
    areaBasedParams.areaCode = areaCode;
    if (areaCode && sigunguCode) {
      areaBasedParams.sigunguCode = sigunguCode;
    }
    const serviceResult = await callService('areaBasedList', areaBasedParams);
    itemsToResult(serviceResult, recommendAreaResult);
    recommendAreaResult.itmes = dropMyContent(contentId, recommendAreaResult.items);
    await checkPlaceInfo(userInfo, recommendAreaResult);
    return recommendAreaResult.items;
  } catch (err) {
    console.error('recommendArea() error');
    console.error(err.message);
    throw err;
  }
}

async function recommendStay(userInfo, areaCode, sigunguCode, contentId) {
  try {
    const recommendStayResult = {};
    recommendStayResult.items = [];
    const stayParams = JSON.parse(JSON.stringify(baseParams));
    stayParams.numOfRows = 15;
    stayParams.listYN = 'Y';
    // 대표 이미지 있는 조회순 정렬
    stayParams.arrange = 'P';
    stayParams.areaCode = areaCode;
    if (areaCode && sigunguCode) {
      stayParams.sigunguCode = sigunguCode;
    }
    let serviceResult = await callService('areaBasedList', stayParams);
    itemsToResult(serviceResult, recommendStayResult);
    recommendStayResult.items = dropMyContent(contentId, recommendStayResult.items);
    await checkPlaceInfo(userInfo, recommendStayResult);
    for (const item of recommendStayResult.items) {
      const introParams = JSON.parse(JSON.stringify(baseParams));
      introParams.params.contentId = item.contentID;
      introParams.params.contentTypeId = item.contentTypeId;
      serviceResult = await callService('datailIntro', introParams);
      const info = serviceResult.items.item;
      item.checkInTime = info.checkintime;
      item.checkOutTime = info.checkouttime;
      item.parkAvailable = info.parkinglodging;
      item.contact = info.infocenterlodging;
    }
    return recommendStayResult.items;
  } catch (err) {
    console.error('recommendArea() error');
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  recommendLocation,
  recommendArea,
  recommendStay,
};
