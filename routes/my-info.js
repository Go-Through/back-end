const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { updateUserInfo } = require('../service/manage-user');
const { connectCouple, dealWithEvent, checkEvent } = require('../service/manage-couple');
const { getBasketPlaces, getSearchPlaces } = require('../service/manage_my_place');

const router = express.Router();

/**
 * @api {get} /my-info 1. My Info (TEST)
 * @apiName my info test call api
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    message: ''
 *  }
 */
router.get('/', authenticateUser, (req, res, next) => {
  res.send({
    message: 'success',
  });
});

/**
 * @api {get} /my-info/basket 2. Basket Place
 * @apiName basket
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} basket 찜한 장소
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/basket', authenticateUser, async (req, res, next) => {
  let result;
  try {
    result = await getBasketPlaces(req.user);
  } catch (err) {
    console.error('basket error');
    console.error(err.message);
    throw err;
  }
  res.send(result);
});

/**
 * @api {get} /my-info/search 3. Search Place
 * @apiName search
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} bascket 조회한 장소
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/search', authenticateUser, async (req, res, next) => {
  let result;
  try {
    result = await getSearchPlaces(req.user);
  } catch (err) {
    console.error('search error');
    console.error(err.message);
    throw err;
  }
  res.send(result);
});

/**
 * @api {put} /my-info/change-info 4. Change Info
 * @apiName change info
 * @apiGroup 4. My Info
 *
 * @apiParam {JSON} updateObject 구성요소: nickname 바꿀 닉네임, id 바꿀 아이디, 아이디 규칙 지켜야함, password 바꿀 패스워드, 패스워드 규칙 지켜야 함.
 *
 * @apiSuccess {JSON} message success 메시지 다양함 (길이문제, 실패, 성공, 이미 존재)
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.put('/change-info', authenticateUser, async (req, res, next) => {
  let result;
  try {
    const { updateObject } = req.body;
    if (updateObject) {
      result = await updateUserInfo(req.user.id, req.user.socialType, updateObject);
    } else {
      result = {
        message: 'Input body - updateObject',
      };
    }
  } catch (err) {
    console.error('change-info error');
    console.error(err.message);
    throw err;
  }
  res.send({
    message: result,
  });
});

/**
 * @api {post} /my-info/post-event 5. Post Event
 * @apiName post event
 * @apiGroup 4. My Info
 *
 * @apiParam {int} targetId 등록하고자 하는 커플 아이디의 디비 인덱스 (get_candidate_id 참고)
 * @apiParam {boolean} connectOption 연결 요청 = true, 연결 해제 = false
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.post('/post-event', authenticateUser, async (req, res, next) => {
  let result;
  try {
    const { targetId, connectOption } = req.query;
    if (targetId && connectOption) {
      result = await connectCouple(req.user.id, targetId, connectOption);
    } else {
      result = {
        message: 'Input query - targetId, connectOption',
      };
    }
  } catch (err) {
    console.error('post-event error');
    console.error(err.message);
    throw err;
  }
  res.send(result);
});

/**
 * @api {get} /my-info/event 6. Get Event
 * @apiName get event
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} message event 있는지 없는지, 해제 이벤트가 있을 시 알아서 처리되며,
 * 이 사실을 알지 못함 message = 'disconnect', 등록 이벤트가 있을 시 요청한 아아디의 디비 인덱스 리턴, 이벤트 없으면 'no event'
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/event', authenticateUser, async (req, res ,next) => {
  let result;
  try {
    if (req.user.withEvent !== null) {
      result = await checkEvent(req.user);
    } else {
      result = 'no event';
    }
  } catch (err) {
    console.error('event error');
    console.error(err.message);
    throw err;
  }
  res.send({
    message: result,
  });
});

/**
 * @api {post} /my-info/process-couple 8. Process Couple
 * @apiName process couple
 * @apiGroup 4. My Info
 *
 * @apiParam {boolean} acceptOption 수락하기-true, 거절하기-false
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.post('process-couple', authenticateUser, async (req, res, next) => {
  let result;
  try {
    const { acceptOption } = req.query;
    if (acceptOption) {
      result = await dealWithEvent(req.user, acceptOption);
    } else {
      result = {
        message: 'Input query - acceptOption',
      };
    }
  } catch (err) {
    console.error('process-couple error');
    console.error(err.message);
    throw err;
  }
  res.send(result);
});

module.exports = router;
