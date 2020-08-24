const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { getMyPlace, getTripInfo } = require('../service/manage-trip');

const router = express.Router();

/**
 * @api {get} /trip-info 1. Trip Info
 * @apiName trip info
 * @apiGroup 3. Trip
 *
 * @apiParam order 정렬 순서 선택 0-count, 1-bascket, 2-title
 *
 * @apiSuccess {JSON} Info 추천여행지 정보
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
    // eslint-disable-next-line max-len
    tripInfoResult = await getMyPlace(req.user.id, parseInt(req.query.order, 10));
  } catch (err) {
    console.error('trip info error');
    console.error(err.message);
    throw err;
  }
  res.send(tripInfoResult);
});

/**
 * @api {get} /trip-info/detail/:contentId 2. Detail Info
 * @apiName detail info
 * @apiGroup 3. Trip
 *
 * @apiParam contentId
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/detail/:contentId', authenticateUser, async (req, res, next) => {
});

// 추천하는 장소용: query로 위도, 경도 필요 (location based 쓸 예정)
/**
 * @api {get} /location 3. Recommend Location
 * @apiName recommend location
 * @apiGroup 3. Trip
 *
 * @apiParam locationX
 * @apiParam locationY
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/location', authenticateUser, async (req, res, next) => {
});

// 시군구 위치에 따른 여행지 추천, query로 areaCode, sigungu Code 필요 (area Based)
/**
 * @api {get} /place 4. Area Based Place
 * @apiName area based place
 * @apiGroup 3. Trip
 *
 * @apiParam areaCode
 * @apiParam [sigunguCode] optional
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/place', authenticateUser, async (req, res, next) => {
});

// 근처 숙소 필요
/**
 * @api {get} /room 5. Room Place
 * @apiName room place
 * @apiGroup 3. Trip
 *
 * @apiParam areaCode
 * @apiParam [sigunguCode] optional
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/room', authenticateUser, async(req, res, next) => {
});

module.exports = router;
