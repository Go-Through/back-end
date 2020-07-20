const express = require('express');
const passport = require('passport');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('Hello');
});

router.get('/main', (req, res, next) => {
  res.send('main');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
}));

router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/main',
  failureRedirect: '/',
}));

module.exports = router;
