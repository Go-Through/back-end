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
 *    "intro": {
 *        "use": {
 *            "key1": {
 *                "key": "문의 및 안내",
 *                "value": "공원녹지과  02-2155-6870"
 *            },
 *            "key2": {
 *                "key": "체험 가능 연령"
 *             },
 *            "key3": {
 *                "key": "이용 시간",
 *                "value": ""
 *            },
 *            "key4": {
 *                "key": "쉬는 날"
 *            },
 *            "key5": {
 *                "key": "수용 인원"
 *            }
 *       },
 *        "facility": {
 *            "key1": "유모차 대여 없음",
 *            "key2": "신용카드 없음",
 *            "key3": "있음"
 *        }
 *    },
 *    "common": {
 *        "area": "서울 서초구",
 *        "title": "청계산",
 *        "address": "서울특별시 서초구 원터길\n경기도 성남시ㆍ과천시ㆍ의왕시",
 *        "heart": false,
 *        "introStr": "서울대공원과 서울랜드, 국립현대미술관을 둘러싼 푸른 산자락이 바로 청계산이다. 서울 양재동과 과천시, 성남시,의왕시의 경계를 이루고 있는 청계산은 관악산 산자락이 과천 시내를 에둘러 남쪽으로 뻗어내린 것이다. 산맥은 여기서 멈추지 않고 서남쪽으로 뻗어나가 의왕시의 백운산, 모락산, 오봉산으로 이어진다. 청계산은 조선 태조 이성계에 의해 고려가 멸망하자, 고려말 충신이었던 조윤(趙胤)이 송도를 떠나 입산했던 곳이라고 전해진다. 청룡이 승천했던 곳이라고해서 청룡산으로 불리기도 하며 풍수지리학적으로는 관악산을 백호, 청계산을 청룡이라하여 '좌청룡 우백호'의 개념으로 해석하기도 한다.\n\n청계산은 울창한 숲과 아늑한 계곡, 공원, 사찰 등 다양한 볼거리가 있는 가족산행의 명소로서 수 많은 등산로가 다양하게 형성되어 있다. 과천쪽에서 바라보는 청계산은 산세가 부드럽고 온화해서 토산처럼 보이지만, 서울대공원쪽에서 보이는 망경대는 바위로 둘러싸여 있어 거칠고 당당하게 보인다. 망경대(해발 618.2m)가 바로 청계산의 정상이다.\n\n주암동쪽에서 망경대 쪽으로 오르다 보면 추사 김정희의 생부김노경의 묘터가 있던 옥녀봉이 나타난다. 조선시대의 학자인 정여창이 피눈물을 흘리며 넘었다는 혈읍재를 지나 망경대 바로 밑으로 가면 정여창이 은거했다는 금정수가 있다. 이 약수는 정여창이 사사되자 핏빛으로 변했다가 이내 금빛으로 물들었다는 말이 전해온다.<BR>풀향기 가득한 산길을 걷다보면 야생밤나무와 도토리나무, 머루와 다래 등이 종종 눈길을 끈다. 청계산 남쪽에 위치한 청계사, 과천 쪽의 동폭포, 금정수 가는 길 근처의 매바위와 돌문바위, 약수터 등도 들러 볼 만하다.\n\n청계산(618m)은 산세가 수려하고, 2km에 이르는 계곡에는 항상 맑은 물이 흘러 시민들이 즐겨찾는다. 관악산과 함께 서울을 지켜주는 '좌청룡 우백호'의 명산이기도 하다. 예전에는 청룡산이라고도 했던 청계산은 두 개의 얼굴을 가지고 있다. 양재인터체인지를 지나 경부고속도로로 접어들때 오른쪽으로 보이는 청계산은 순한 육산이지만, 과천 서울대공원 정문 부근에서  바라보는 청계산 정상인 망경대 주위는 바위로 이루어져 있어 위압감을 느낀다. 정상인 망경대는 정부시설이 있어 등산이 불가, 국사봉(538m)과 545m봉을 연결 산행하고 있다.",
 *        "mapx": 127.0543676446,
 *        "mapy": 37.4416867721,
 *        "homepage": "서초 문화관광 -&nbsp;청계산 소개&nbsp;<a title=\"새창 : 서초 문화관광 청계산 소개 페이지로 이동\" href=\"http://www.seocho.go.kr/site/seocho/04/10405010701002015072403.jsp\" target=\"_blank\">http://www.seocho.go.kr</a>",
 *        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/41/2023841_image2_1.jpg",
 *        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/41/2023841_image3_1.jpg"
 *    }
 * }
 */
router.get('/detail', authenticateUser, async (req, res, next) => {
  let detailInfo;
  try {
    const { contentId, contentTypeId } = req.query;
    if (!contentId || !contentTypeId) {
      res.send({
        message: 'Input query - contentId, contentTypeId',
      });
      return;
    }
    // eslint-disable-next-line max-len
    detailInfo = await getCommonInfo(req.user, parseInt(contentId, 10), parseInt(contentTypeId, 10));
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
router.get('/location', authenticateUser, async (req, res, next) => {
  let locationRecommend = {};
  try {
    const { locationX, locationY, nowContentId } = req.query;
    if (!locationX || !locationY || !nowContentId) {
      res.send({
        message: 'Input query - locationX, locationY, nowContentId',
      });
      return;
    }
    locationRecommend = await recommendLocation(req.user,
      parseFloat(locationX), parseFloat(locationY), parseFloat(nowContentId));
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
router.get('/area', authenticateUser, async (req, res, next) => {
  let areaRecommend = {};
  try {
    const { areaCode, sigunguCode, nowContentId } = req.query;
    if (!areaCode || !nowContentId) {
      res.send({
        message: 'Input query - areaCode, nowContentId',
      });
      return;
    }
    areaRecommend = await recommendArea(req.user,
      parseInt(areaCode, 10), parseInt(sigunguCode, 10), parseInt(nowContentId, 10));
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
router.get('/stay', authenticateUser, async (req, res, next) => {
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
    stayRecommend = await recommendStay(req.user, parseInt(areaCode, 10),
      parseInt(sigunguCode, 10), parseInt(nowContentId, 10), parseInt(order, 10));
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
  let result = 'fail';
  try {
    const { contentId } = req.body;
    if (!contentId) {
      res.send({
        message: 'Input query - contentId',
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
