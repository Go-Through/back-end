const express = require('express');

const { authenticateUser } = require('../service/init-module');

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
router.get('/serach', authenticateUser, async (req, res, next) => {
});

/**
 * @api {put} /my-info/change_info 4. Change Info
 * @apiName change info
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.put('/change_info', authenticateUser, async (req, res, next) => {
});

// event 확인 (요청 왔는지)
/**
 * @api {get} /my-info/event 5. Get Event
 * @apiName get event
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/event', authenticateUser, async (req, res ,next) => {
});

// 수락하기
/**
 * @api {post} /my-info/post_event 6. Post Event
 * @apiName post event
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.post('/post_event', authenticateUser, async (req, res, next) => {
});

/**
 * @api {get} /my-info/get_candidate_id 7. Get Candidate ID
 * @apiName get candidate id
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/get_candidate_id', authenticateUser, async (req, res, next) => {

});

// 회원가입때도 사용 가능 (있는 아이디인지 없는 아이디인지 확인)
/**
 * @api {post} /my-info/enroll_couple 8. Enroll Couple
 * @apiName enroll couple
 * @apiGroup 4. My Info
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  }
 */
router.post('enroll_couple', authenticateUser, async (req, res, next) => {
});

module.exports = router;
