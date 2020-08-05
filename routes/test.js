const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { enrollTest } = require('../service/manage-test');

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
 * @api {get} /test 2. Post Test
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
  const testObject = req.body.test;
  let enrollResult;
  try {
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

module.exports = router;
