const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { getMyPlace, getTripInfo } = require('../service/manage-trip');

const router = express.Router();

/**
 * @api {get} /trip-info 1. Trip Info
 * @apiName trip info
 * @apiGroup 3. Trip
 *
 * @apiParamm pos 조회하기 시작하는 인덱스 값 default = 0
 * @apiParam offset 몇 개 가져올 것인지 선택 default = 5
 * @apiParam order 정렬 순서 선택
 *
 * @apiSuccess {JSON}
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/', authenticateUser, async (req, res, next) => {
  let tripInfoResult;
  try {
    // eslint-disable-next-line max-len
    tripInfoResult = await getMyPlace(req.user.id, req.query.pos, req.query.offset, req.query.order);
  } catch (err) {
    console.error('trip info error');
    console.error(err.message);
    throw err;
  }
  res.send(tripInfoResult);
});

module.exports = router;
