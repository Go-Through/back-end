const express = require('express');
const passport = require('passport');

const router = express.Router();

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(301).redirect('/');
  }
};

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('Hello');
});

router.get('/main', authenticateUser, (req, res, next) => {
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
  if (req.session) {
    res.session.destroy((err) => {
      if (err) {
        console.error(err.message);
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});

// naver 로그인
router.get('/login/naver', passport.authenticate('naver-signin'));
// naver 로그인 연동 콜백
router.get('/login/naver/callback', passport.authenticate('naver-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.user);
  });
});

// kakao 로그인
router.get('/login/kakao', passport.authenticate('kakao-signin'));
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback', passport.authenticate('kakao-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.user);
  });
});

module.exports = router;
