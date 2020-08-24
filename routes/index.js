const express = require('express');
const passport = require('passport');

const { authenticateUser } = require('../service/init-module');

const router = express.Router();

/**
 * @api {get} / 1. Before Login Call API (TEST)
 * @apiName before
 * @apiGroup 1. User
 *
 * @apiSuccess {JSON} message 'fail'
 * @apiSuccessExample {JSON} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    message: 'fail'
 *  }
 */
router.get('/', (req, res, next) => {
  res.send({
    message: 'Fail',
  });
});

/**
 * @api {get} /main 2. After Login Call API (TEST)
 * @apiName main
 * @apiGroup 1. User
 *
 * @apiSuccess {JSON} message 'success'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: 'success'
 *  }
 */
router.get('/main', authenticateUser, (req, res, next) => {
  res.send({
    message: 'Success',
  });
});

/**
 * @api {post} /sign_up 3. Local Sign up
 * @apiName sign_up
 * @apiGroup 1. User
 *
 * @apiParam {String} nickname Users nickname
 * @apiParam {String} id Users unique ID
 * @apiParam {String} password Users PW
 *
 * @apiSuccess {JSON} message 'sign up success'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: 'sign up success'
 *  }
 */
router.post('/sign_up', passport.authenticate('local-signup', {
  failureRedirect: '/',
}), (req, res) => {
  res.send({
    message: 'Sign up success',
  });
});

/**
 * @api {post} /login 4. Local Login
 * @apiName login
 * @apiGroup 1. User
 *
 * @apiParam {String} id Users unique ID
 * @apiParam {String} password Users PW
 *
 * @apiSuccess {JSON} user user info
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
      "cookie": {
          "originalMaxAge": null,
          "expires": null,
          "httpOnly": true,
          "path": "/"
      },
      "passport": {
          "user": 1
      }
    }
 */
router.post('/login', passport.authenticate('local-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.session);
  });
});

/**
 * @api {get} /login/naver 5. Naver Login
 * @apiName login naver
 * @apiGroup 1. User
 *
 * @apiSuccess {JSON} user user info
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    id: ""
 *  }
 */
router.get('/login/naver', passport.authenticate('naver-signin'));
// naver 로그인 연동 콜백
router.get('/login/naver/callback', passport.authenticate('naver-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.session);
  });
});

/**
 * @api {get} /login/kakao 6. Kakao Login
 * @apiName login kakao
 * @apiGroup 1. User
 *
 * @apiSuccess {JSON} user user info
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    id: ""
 *  }
 */
router.get('/login/kakao', passport.authenticate('kakao-signin'));
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback', passport.authenticate('kakao-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send(req.session);
  });
});

/**
 * @api {get} /logout 7. Logout
 * @apiName logout
 * @apiGroup 1. User
 *
 * @apiSuccess {JSON} message 'logout'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: 'logout'
 *  }
 */
router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save(() => {
    res.send({
      message: 'logout',
    });
  });
});

module.exports = router;
