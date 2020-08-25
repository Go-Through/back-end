const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { enrollTest, getTotalTest } = require('../service/manage-test');

const router = express.Router();

/**
 * @api {get} /test 1. Test Main
 * @apiName test main
 * @apiGroup 2. Test
 *
 * @apiSuccess {JSON} message 'test'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: 'test'
 *  }
 */
router.get('/', authenticateUser, (req, res, next) => {
  res.send({
    message: 'test',
  });
});

/**
 * @api {get} /post_test 2. Post Test
 * @apiName post test
 * @apiGroup 2. Test
 *
 * @apiParam {Int} id User unique index for database
 * @apiParam {JSON} test test 안에는 place(array type), concept(array type) 존재
 *
 * @apiSuccess {JSON} message 'success'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: 'success'
 *  }
 */
router.post('/post_test', authenticateUser, async (req, res, next) => {
  let enrollResult;
  try {
    if (!req.body.test) {
      res.send('Input body. test');
    }
    const testObject = req.body.test;
    enrollResult = await enrollTest(req.user.id, testObject);
  } catch (err) {
    console.error('post_test() error');
    console.error(err.message);
    throw err;
  }
  res.send({
    message: enrollResult,
  });
});

/**
 * @api {get} /get_test 3. get Test
 * @apiName get test
 * @apiGroup 3. Test
 *
 * @apiSuccess {JSON} Object Test object with my friend
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "area": [
 *       {
 *           "id": 1,
 *           "area_code": 1,
 *           "area_name": "서울"
 *       },
 *       {
 *           "id": 27,
 *           "area_code": 2,
 *           "area_name": "인천"
 *       },
 *       {
 *           "id": 247,
 *           "area_code": 39,
 *           "area_name": "제주도"
 *       }
 *   ],
 *   "category": [
 *       {
 *           "id": 6,
 *           "category_code": "A01010400",
 *           "category_name": "산"
 *       },
 *       {
 *           "id": 11,
 *           "category_code": "A01010900",
 *           "category_name": "계곡"
 *       },
 *       {
 *           "id": 14,
 *           "category_code": "A01011200",
 *           "category_name": "해수욕장"
 *       }
 *   ]
 *  }
 */
router.get('/get_test', authenticateUser, async (req, res, next) => {
  let testResult;
  try {
    testResult = await getTotalTest(req.user.id);
  } catch (err) {
    console.error('get_test() error');
    console.error(err.message);
    throw err;
  }
  res.send(testResult);
});

module.exports = router;
