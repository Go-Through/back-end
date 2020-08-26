const express = require('express');

const { authenticateUser } = require('../service/init-module');
// const { calculateShortest } = require('../service/calculate-short-path');

const router = express.Router();

router.get('/', authenticateUser, (req, res, next) => {
  res.send({
    message: 'not supported',
  });
});

router.post('/', authenticateUser, (req, res, next) => {
  res.send({
    message: 'fail',
  });
});

module.exports = router;
