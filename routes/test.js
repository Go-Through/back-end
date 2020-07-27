const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { enrollTest } = require('../service/manage-test');

const router = express.Router();

router.get('/', authenticateUser, (req, res, next) => {
  res.send('test');
});

router.post('/post_test', authenticateUser, async (req, res, next) => {
  const testObject = req.body.test;
  const enrollResult = await enrollTest(testObject);
  res.send(enrollResult);
});

module.exports = router;
