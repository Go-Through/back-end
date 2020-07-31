const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { enrollTest } = require('../service/manage-test');

const router = express.Router();

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/', authenticateUser, (req, res, next) => {
  res.send('test');
});

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
/*
post_test body 형태
{
  id: [int]
  test: {
    location: [Array Type],
    concept: [Array Type],
  }
}
*/
router.post('/post_test', authenticateUser, async (req, res, next) => {
  const userIdx = req.body.id;
  const testObject = req.body.test;
  const enrollResult = await enrollTest(userIdx, testObject);
  res.send(enrollResult);
});

module.exports = router;
