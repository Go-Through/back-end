const { callService, baseParams, models } = require('./init-module');

// 하트 누른건지 아닌지 확인하는 함수 (여행지 정보 첫 페이지에서 활용할 예정)
async function checkBasket(userInfo, contentId) {
  let result = false;
  try {
    if (userInfo.basketPlaces) {
      const userBasketInfo = userInfo.basketPlaces;
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

function makeIntroInfo(contentTypeId, introInfo) {
  const result = {};
  const useInfo = {};
  const facilityInfo = {};
  // 키 값이 총 8가지 (이용안내 - 문의 및 안내, 이용시간, 쉬는날, 이용요금, 관람 소요 / 편의시설)
  if (contentTypeId === 12) {
    useInfo.key1 = {
      key: '문의 및 안내',
      value: introInfo.infocenter,
    };
    useInfo.key2 = {
      key: '체험 가능 연령',
      value: introInfo.expagerange,
    };
    useInfo.key3 = {
      key: '이용 시간',
      value: introInfo.usetime,
    };
    useInfo.key4 = {
      key: '쉬는 날',
      value: introInfo.restdate,
    };
    useInfo.key5 = {
      key: '수용 인원',
      value: introInfo.accomcount,
    };
    result.use = useInfo;
    facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriage}`;
    facilityInfo.key2 = `신용카드 ${introInfo.chkcreditcard}`;
    facilityInfo.key3 = introInfo.parking;
    result.facility = facilityInfo;
  } else if (contentTypeId === 14) {
    useInfo.key1 = {
      key: '문의 및 안내',
      value: introInfo.infocenterculture,
    };
    useInfo.key2 = {
      key: '이용 요금',
      value: introInfo.usefee,
    };
    useInfo.key3 = {
      key: '이용 시간',
      value: introInfo.usetimeculture,
    };
    useInfo.key4 = {
      key: '쉬는 날',
      value: introInfo.restdateculture,
    };
    useInfo.key5 = {
      key: '수용 인원',
      value: introInfo.accomcountculture,
    };
    result.use = useInfo;
    facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriageculture}`;
    facilityInfo.key2 = `신용카드 ${introInfo.chkcreditcardculture}`;
    facilityInfo.key3 = introInfo.parkingculture;
    result.facility = facilityInfo;
  } else if (contentTypeId === 15) {
    useInfo.key1 = {
      key: '행사 홈페이지',
      value: introInfo.eventhomepage,
    };
    useInfo.key2 = {
      key: '관람 가능 연령',
      value: introInfo.agelimit,
    };
    useInfo.key3 = {
      key: '행사 시작일',
      value: introInfo.eventstartdate,
    };
    useInfo.key4 = {
      key: '행사 종료일',
      value: introInfo.eventenddate,
    };
    useInfo.key5 = {
      key: '공연시간',
      value: introInfo.playtime,
    };
    result.use = useInfo;
    facilityInfo.key1 = `예매처 ${introInfo.bookingplace}`;
    facilityInfo.key2 = `할인 ${introInfo.discountinfofestival}`;
    facilityInfo.key3 = introInfo.placeinfo;
    result.facility = facilityInfo;
  } else if (contentTypeId === 28) {
    useInfo.key1 = {
      key: '문의 및 안내',
      value: introInfo.infocenterleports,
    };
    useInfo.key2 = {
      key: '체험 가능 연령',
      value: introInfo.expagerangeleports,
    };
    useInfo.key3 = {
      key: '이용 시간',
      value: introInfo.usetimeleports,
    };
    useInfo.key4 = {
      key: '쉬는 날',
      value: introInfo.restdateleports,
    };
    useInfo.key5 = {
      key: '수용 인원',
      value: introInfo.accomcountleports,
    };
    result.use = useInfo;
    facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriageleports}`;
    facilityInfo.key2 = `신용카드 ${introInfo.chkcreditcardleports}`;
    facilityInfo.key3 = introInfo.parkingleports;
    result.facility = facilityInfo;
  } else if (contentTypeId === 32) {
    useInfo.key1 = {
      key: '문의 및 안내',
      value: introInfo.infocenterlodging,
    };
    useInfo.key2 = {
      key: '입실 시간',
      value: introInfo.checkintime,
    };
    useInfo.key3 = {
      key: '퇴실 시간',
      value: introInfo.checkouttime,
    };
    useInfo.key4 = {
      key: '수용 가능 인원',
      value: introInfo.accomcountlodging,
    };
    useInfo.key5 = {
      key: '홈페이지',
      value: introInfo.reservationurl,
    };
    result.use = useInfo;
    facilityInfo.key1 = `바베큐 ${introInfo.barbecue}`;
    facilityInfo.key2 = `객실 내 취사 ${introInfo.chkcooking}`;
    facilityInfo.key3 = introInfo.parkinglodging;
    result.facility = facilityInfo;
  } else if (contentTypeId === 38) {
    useInfo.key1 = {
      key: '문의 및 안내',
      value: introInfo.infocentershopping,
    };
    useInfo.key2 = {
      key: '매장 안내',
      value: introInfo.shopguide,
    };
    useInfo.key3 = {
      key: '영업 시간',
      value: introInfo.opentime,
    };
    useInfo.key4 = {
      key: '쉬는 날',
      value: introInfo.restdateshopping,
    };
    useInfo.key5 = {
      key: '바로 가기',
      value: introInfo.culturecenter,
    };
    result.use = useInfo;
    facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriageshopping}`;
    facilityInfo.key2 = `신용카드 ${introInfo.chkcreditcardshopping}`;
    facilityInfo.key3 = introInfo.parkingshopping;
    result.facility = facilityInfo;
  } else if (contentTypeId === 39) {
    useInfo.key1 = {
      key: '문의 및 안내',
      value: introInfo.infocenterfood,
    };
    useInfo.key2 = {
      key: '영업 시간',
      value: introInfo.opentimefood,
    };
    useInfo.key3 = {
      key: '포장',
      value: introInfo.packing,
    };
    useInfo.key4 = {
      key: '쉬는 날',
      value: introInfo.restdatefood,
    };
    useInfo.key5 = {
      key: '좌석 수',
      value: introInfo.seat,
    };
    result.use = useInfo;
    facilityInfo.key1 = `어린이 놀이방 ${introInfo.kidsfacility}`;
    facilityInfo.key2 = `신용카드 ${introInfo.chkcreditcardfood}`;
    facilityInfo.key3 = introInfo.parkingfood;
    result.facility = facilityInfo;
  }
  return result;
}

// 세부 정보 조회 페이지에서 호출, 세부 정보 조회 시 조회 수 올라가고 최근 조회한 여행지에 추가.
async function getCommonInfo(userInfo, contentId, contentTypeId) {
  const result = {};
  const userId = userInfo.id;
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
        const commonInfo = {};
        sqlResult = await models.tourArea.findOne({
          where: {
            areaCode: info.areacode,
            sigunguCode: info.sigungucode,
          },
          attributes: ['area_name', 'sigungu_name'],
        });
        if (sqlResult) {
          const areaInfo = sqlResult.get();
          commonInfo.area = `${areaInfo.area_name} ${areaInfo.sigungu_name}`;
        }
        commonInfo.title = info.title;
        commonInfo.address = `${info.addr1}\n${info.addr2}`;
        commonInfo.heart = false;
        const basketChkResult = await checkBasket(userInfo, info.contentid);
        if (basketChkResult) {
          result.heart = true;
        }
        commonInfo.introStr = info.overview;
        commonInfo.mapx = info.mapx;
        commonInfo.mapy = info.mapy;
        commonInfo.homepage = info.homepage;
        commonInfo.firstimage = info.firstimage;
        commonInfo.firstimage2 = info.firstimage2;
        result.common = commonInfo;
      } else { // Intro
        result.intro = makeIntroInfo(contentTypeId, info);
      }
    }
    // user search place 가져오기
    if (userInfo.searchPlaces) {
      // searchPlace도 마찬가지로 searchItems: [contentId ] 들어갈 예정
      const userSearch = userInfo.searchPlaces;
      const newItems = [];
      if (userSearch && userSearch.searchItems) {
        for (const searchId of userSearch.searchItems) {
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
