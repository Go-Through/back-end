const express = require('express');
const passport = require('passport');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('Hello');
});

router.get('/main', (req, res, next) => {
  res.send('Main');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
}));

router.post('/login', passport.authenticate('local-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.user);
  });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save(() => {
    res.redirect('/');
  });
});

module.exports = router;
