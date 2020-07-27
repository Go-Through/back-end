const express = require('express');

const { authenticateUser } = require('../service/init-module');

const router = express.Router();

router.get('/', authenticateUser, (req, res, next) => {
  res.send('Trip Info');
});

module.exports = router;
