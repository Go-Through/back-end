const express = require('express');
const passport = require('passport');

const { authenticateUser } = require('../service/init-module');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Fail');
});
router.get('/main', authenticateUser, (req, res, next) => {
  res.send('Success');
});

// local sign up
router.post('/sign_up', passport.authenticate('local-signup', {
  failureRedirect: '/',
}), (req, res) => {
  res.send('Sign up success');
});
// local login
router.post('/login', passport.authenticate('local-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.session);
  });
});

// naver 로그인
router.get('/login/naver', passport.authenticate('naver-signin'));
// naver 로그인 연동 콜백
router.get('/login/naver/callback', passport.authenticate('naver-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.session);
  });
});

// kakao 로그인
router.get('/login/kakao', passport.authenticate('kakao-signin'));
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback', passport.authenticate('kakao-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    console.log(req.user, req.session);
    res.send(req.session);
  });
});

// logout
router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save(() => {
    res.redirect('/');
  });
  /* req.session.destroy((err) => {
    console.error(err.message);
    res.redirect('/');
  }); */
});

module.exports = router;
