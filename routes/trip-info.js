const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { getMyPlace } = require('../service/manage-trip');
const { getCommonInfo } = require('../service/detail-info');
const { recommendLocation, recommendArea, recommendStay } = require('../service/recommend-info');

const router = express.Router();

/**
 * @api {get} /trip-info 1. Trip Info
 * @apiName trip info
 * @apiGroup 3. Trip
 *
 * @apiParam {int} [order] 정렬 순서 선택 0-count, 1-bascket, 2-title
 *
 * @apiSuccess {Array} items 추천 여행지 정보 배열
 * @apiSuccess {int} totalCount 총 개수
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
 * @apiParam contentId 컨텐츠 아이디 (Tour API)
 * @apiParam contentTypeId 컨텐츠 타입 (Tour API)
 *
 * @apiSuccess {string} babycarriageRent 유모차 대여 유무
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/detail', authenticateUser, async (req, res, next) => {
  let detailInfo;
  try {
    const { contentId, contentTypeId } = req.query;
    if (!contentId || !contentTypeId) {
      res.send({
        message: 'Input query - contentId, contentTypeId'
      });
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
 * @apiParam {float} locationX 경도
 * @apiParam {float} locationY 위도
 * @apiParam {int} nowContentId 지금 보고있는 컨텐츠 아이디
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/location', authenticateUser, async (req, res, next) => {
  let locationRecommend = {};
  try {
    const { locationX, locationY, nowContentId } = req.query;
    if (!locationX || !locationY || !nowContentId) {
      res.send({
        message: 'Input query - locationX, locationY, nowContentId',
      });
    }
    locationRecommend = await recommendLocation(req.user, locationX, locationY, nowContentId);
  } catch (err) {
    console.error('location error');
    console.error(err.message);
    throw err;
  }
  res.send(locationRecommend);
});

/**
 * @api {get} /trip-info/place 4. Area Based Place
 * @apiName area based place
 * @apiGroup 3. Trip
 *
 * @apiParam {int} areaCode 지역코드
 * @apiParam {int} [sigunguCode] 시군구코드
 * @apiParam {int} nowContentId 지금 보고있는 컨텐츠 아이디
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/place', authenticateUser, async (req, res, next) => {
  let areaRecommend = {};
  try {
    const { areaCode, sigunguCode, nowContentId } = req.query;
    if (!areaCode || !nowContentId) {
      res.send({
        message: 'Input query - areaCode, nowContentId',
      });
    }
    areaRecommend = await recommendArea(req.user, areaCode, sigunguCode, nowContentId);
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
 * @apiParam {int} areaCode 지역 코드
 * @apiParam {int} [sigunguCode] 시군구코드
 * @apiParam {int} nowContentId 지금 보고있는 컨텐츠 아이디
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/stay', authenticateUser, async (req, res, next) => {
  let stayRecommend = {};
  try {
    const { areaCode, sigunguCode, nowContentId } = req.query;
    if (!areaCode || !nowContentId) {
      res.send({
        message: 'Input query - areaCode, nowContentId',
      });
    }
    stayRecommend = await recommendStay(req.user, areaCode, sigunguCode, nowContentId);
  } catch (err) {
    console.error('location error');
    console.error(err.message);
    throw err;
  }
  res.send(stayRecommend);
});

module.exports = router;
