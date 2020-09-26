const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { getMyPlace } = require('../service/manage-trip');
const { getCommonInfo, postBasket } = require('../service/detail-info');
const { recommendLocation, recommendArea, recommendStay } = require('../service/recommend-info');

const router = express.Router();

/**
 * @api {get} /trip-info 1. Trip Info
 * @apiName trip info
 * @apiGroup 3. Trip
 *
 * @apiParam {Number=0,1,2} [order] 정렬 순서 선택 0-count, 1-basket, 2-title
 *
 * @apiSuccess {Object} items 추천 여행지 정보 배열
 * @apiSuccess {Number} totalCount 총 개수
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "items": [
 *       {
 *           "image": "http://tong.visitkorea.or.kr/cms/resource/41/2023841_image2_1.jpg",
 *           "title": "청계산",
 *           "address": "서울특별시 서초구 원터길",
 *           "contentID": 125452,
 *           "cotentTypeID": 12,
 *           "placeCount": 0,
 *           "placeHeart": 0
 *       },
 *       ...
 *   ],
 *   totalCount: 145
 *  }
 */
router.get('/', authenticateUser, async (req, res, next) => {
  let tripInfoResult;
  try {
    if (req.query.order && (req.query.order < 0 && req.query.order > 2)) {
      res.send({
        message: 'Query parameter order must range (0~2)',
      });
      return;
    }
    // eslint-disable-next-line max-len
    tripInfoResult = await getMyPlace(req.user, parseInt(req.query.order, 10));
  } catch (err) {
    console.error('trip-info error');
    console.error(err.message);
    throw err;
  }
  res.send(tripInfoResult);
});

/**
 * @api {get} /trip-info/detail 2. Detail Info
 * @apiName detail info
 * @apiGroup 3. Trip
 *
 * @apiParam {Number} contentId 컨텐츠 아이디 (Tour API)
 * @apiParam {Number} contentTypeId 컨텐츠 타입 (Tour API)
 *
 * @apiSuccess {JSON} Object 상세 정보, 키 안의 key, value 값 다 다름.
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "intro": {
 *      "use": {
 *           "key1": {
 *               "key": "문의 및 안내",
 *               "value": "031-828-8000"
 *           },
 *           "key2": {
 *               "key": "이용 시간",
 *               "value": ""
 *           },
 *           "key3": {
 *               "key": "이용 시기"
 *           },
 *           "key4": {
 *               "key": "쉬는 날",
 *               "value": "연중무휴"
 *           },
 *           "key5": {
 *               "key": "수용 인원"
 *           }
 *       },
 *       "facility": {
 *           "key1": "유모차 대여 불가",
 *           "key2": "애완동물 불가",
 *           "key3": "주차 있음"
 *       }
 *   },
 *   "common": {
 *       "area": "서울 도봉구",
 *       "title": "도봉산",
 *       "address": "서울특별시 도봉구 도봉산길\n(일대)",
 *       "heart": false,
 *       "introStr": "북한산국립공원내 동북쪽에 있는 '도봉산'은 최고봉인 자운봉(740.2m)을 비롯하여 만장봉, 선인봉, 주봉, 오봉, 우이암 등의 암벽이 아름답기로 이름난 산인데 특히, 선인봉 암벽 등반코스로는 박쥐코스 등 37개 코스가 개척되어 있다.북한산 및 도봉산 지역의 60여 개 사찰 중 제일 오래된 건축물인 '천축사'를 비롯하여 망월사, 회룡사 등의 절과 도봉계곡, 송추계곡, 오봉계곡, 용어천계곡 등 아름다운 계곡을 안고 있으며, 교통이 편리하여 서울시민이나 근교 주민들에게 더없이 인기있는 하루 등산지이다.",
 *       "areaCode": 1,
 *       "sigunguCode": 10,
 *       "mapx": 127.0184192271,
 *       "mapy": 37.6969870145,
 *       "homepage": "<a href=\"http://bukhan.knps.or.kr/\" target=\"_blank\" title=\"북한산국립공원 사이트로 이동\">http://bukhan.knps.or.kr</a>",
 *       "firstimage": "http://tong.visitkorea.or.kr/cms/resource/65/1894465_image2_1.jpg",
 *       "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/65/1894465_image3_1.jpg"
 *   }
 * }
 */
router.get('/detail', async (req, res, next) => {
  let detailInfo;
  try {
    const { contentId, contentTypeId } = req.query;
    if (!contentId || !contentTypeId) {
      res.send({
        message: 'Input query - contentId, contentTypeId',
      });
      return;
    }
    if (req.user) {
      // eslint-disable-next-line max-len
      detailInfo = await getCommonInfo(req.user, parseInt(contentId, 10), parseInt(contentTypeId, 10));
    } else {
      detailInfo = await getCommonInfo(null, parseInt(contentId, 10), parseInt(contentTypeId, 10));
    }
  } catch (err) {
    console.error('detail error');
    console.error(err.message);
    throw err;
  }
  res.send(detailInfo);
});

/**
 * @api {get} /trip-info/location 3. Recommend Location
 * @apiName recommend location
 * @apiGroup 3. Trip
 *
 * @apiParam {Number} locationX 경도
 * @apiParam {Number} locationY 위도
 * @apiParam {Number} nowContentId 지금 보고있는 컨텐츠 아이디
 *
 * @apiSuccess {JSON} message 위치 기반 추천 장소
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *        "contentID": 1926045,
 *        "cotentTypeID": 39,
 *        "title": "국시명가",
 *        "address": "서울특별시 서초구 원터1길 4",
 *        "image": "http://tong.visitkorea.or.kr/cms/resource/99/1923299_image2_1.jpg",
 *        "placeCount": 0,
 *        "placeHeart": 0,
 *        "heartFlag": false
 *   },
 * ]
 */
router.get('/location', async (req, res, next) => {
  let locationRecommend = {};
  try {
    const { locationX, locationY, nowContentId } = req.query;
    if (!locationX || !locationY || !nowContentId) {
      res.send({
        message: 'Input query - locationX, locationY, nowContentId',
      });
      return;
    }
    if (req.user) {
      locationRecommend = await recommendLocation(req.user,
        parseFloat(locationX), parseFloat(locationY), parseFloat(nowContentId));
    } else {
      locationRecommend = await recommendLocation(null,
        parseFloat(locationX), parseFloat(locationY), parseFloat(nowContentId));
    }
  } catch (err) {
    console.error('location error');
    console.error(err.message);
    throw err;
  }
  res.send(locationRecommend);
});

/**
 * @api {get} /trip-info/area 4. Area Based Place
 * @apiName area based place
 * @apiGroup 3. Trip
 *
 * @apiParam {Number} areaCode 지역코드
 * @apiParam {Number} [sigunguCode] 시군구코드
 * @apiParam {Number} nowContentId 지금 보고있는 컨텐츠 아이디
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *    {
 *       "contentID": 1426106,
 *       "cotentTypeID": 15,
 *       "title": "서울 코믹월드 2020",
 *       "address": "서울특별시 서초구 강남대로 27",
 *       "image": "http://tong.visitkorea.or.kr/cms/resource/72/2551772_image2_1.JPG",
 *       "placeCount": 0,
 *       "placeHeart": 0,
 *       "heartFlag": false
 *     },
 *  ]
 */
router.get('/area', async (req, res, next) => {
  let areaRecommend = {};
  try {
    const { areaCode, sigunguCode, nowContentId } = req.query;
    if (!areaCode || !nowContentId) {
      res.send({
        message: 'Input query - areaCode, nowContentId',
      });
      return;
    }
    if (req.user) {
      areaRecommend = await recommendArea(req.user,
        parseInt(areaCode, 10), parseInt(sigunguCode, 10), parseInt(nowContentId, 10));
    } else {
      areaRecommend = await recommendArea(null,
        parseInt(areaCode, 10), parseInt(sigunguCode, 10), parseInt(nowContentId, 10));
    }
  } catch (err) {
    console.error('location error');
    console.error(err.message);
    throw err;
  }
  res.send(areaRecommend);
});

/**
 * @api {get} /trip-info/stay 5. Stay Place
 * @apiName stay place
 * @apiGroup 3. Trip
 *
 * @apiParam {Number} areaCode 지역 코드
 * @apiParam {Number} [sigunguCode] 시군구코드
 * @apiParam {Number} nowContentId 지금 보고있는 컨텐츠 아이디
 * @apiParam {Number=0,1,2} [order] 정렬 순서 선택 0-count, 1-basket, 2-title
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *    {
 *       "contentID": 142790,
 *       "contentTypeID": 32,
 *       "title": "The-K호텔서울 (더케이호텔서울)",
 *       "address": "서울특별시 서초구 바우뫼로12길 70",
 *       "image": "http://tong.visitkorea.or.kr/cms/resource/90/2014990_image2_1.jpg",
 *       "placeCount": 0,
 *       "placeHeart": 0,
 *       "heartFlag": false,
 *       "checkInTime": "15:00",
 *       "checkOutTime": "12:00",
 *       "parkAvailable": "주차 가능",
 *       "contact": "02-571-8100"
      },
 *  ]
 */
router.get('/stay', async (req, res, next) => {
  let stayRecommend = {};
  try {
    const {
      areaCode, sigunguCode, nowContentId, order,
    } = req.query;
    if (!areaCode || !nowContentId) {
      res.send({
        message: 'Input query - areaCode, nowContentId',
      });
      return;
    }
    if (req.query.order && (req.query.order < 0 && req.query.order > 2)) {
      res.send({
        message: 'Query parameter order must range (0~2)',
      });
      return;
    }
    if (req.user) {
      stayRecommend = await recommendStay(req.user, parseInt(areaCode, 10),
        parseInt(sigunguCode, 10), parseInt(nowContentId, 10), parseInt(order, 10));
    } else {
      stayRecommend = await recommendStay(null, parseInt(areaCode, 10),
        parseInt(sigunguCode, 10), parseInt(nowContentId, 10), parseInt(order, 10));
    }
  } catch (err) {
    console.error('location error');
    console.error(err.message);
    throw err;
  }
  res.send(stayRecommend);
});

/**
 * @api {post} /trip-info/post-basket 6. Post Basket
 * @apiName post basket
 * @apiGroup 3. Trip
 *
 * @apiParam {Number} contentId 컨텐츠 아이디
 * @apiParamExample {JSON} Request-Example:
 * {
 *   "contentId": 125452
 * }
 *
 * @apiSuccess {JSON} message 성공 시 'success' 실패시 반영 안되고 'fail'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "success",
 *  }
 */
router.post('/post-basket', authenticateUser, async (req, res, next) => {
  let result;
  try {
    const { contentId } = req.body;
    if (!contentId) {
      res.send({
        message: 'Input body - contentId',
      });
      return;
    }
    result = await postBasket(req.user, parseInt(contentId, 10));
  } catch (err) {
    console.error('post-basket error');
    console.error(err.message);
    throw err;
  }
  res.send(result);
});

module.exports = router;
