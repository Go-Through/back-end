const express = require('express');
const passport = require('passport');

const { authenticateUser } = require('../service/init-module');

const router = express.Router();

/**
 * @api {get} / 1. Before Login Call API (TEST)
 * @apiName before
 * @apiGroup 1. User
 *
 * @apiSuccess {string} message 'fail'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "fail"
 *  }
 */
router.get('/', (req, res, next) => {
  res.send({
    message: "fail",
  });
});

/**
 * @api {get} /main 2. After Login Call API (TEST)
 * @apiName main
 * @apiGroup 1. User
 *
 * @apiSuccess {string} message 'success'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "success"
 *  }
 */
router.get('/main', authenticateUser, (req, res, next) => {
  res.send({
    message: 'success',
  });
});

/**
 * @api {post} /sign-up 3. Local Sign up
 * @apiName sign up
 * @apiGroup 1. User
 *
 * @apiParam {string} nickname Users nickname
 * @apiParam {string} id Users unique ID
 * @apiParam {string} password Users PW
 *
 * @apiSuccess {string} message 'sign up success'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "sign up success"
 *  }
 */
router.post('/sign-up', passport.authenticate('local-signup', {
  failureRedirect: '/',
}), (req, res) => {
  res.send({
    message: 'sign up success',
  });
});

/**
 * @api {post} /login 4. Local Login
 * @apiName login
 * @apiGroup 1. User
 *
 * @apiParam {string} id Users unique ID
 * @apiParam {string} password Users PW
 *
 * @apiSuccess {JSON} session cookie info & passport - passport.user is session
 * @apiSuccess {string} nickname user nickname
 * @apiSuccess {boolean} testFlag 테스트 했는지 유무 (테스트를 해야 여행지 정보 조회가능)
 * @apiSuccess {string} socialType 소셜타입: 마이페이지에서 로컬 타입만 정보 수정 가능하기 때문
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "session": {
 *       "cookie": {
 *           "originalMaxAge": null,
 *           "expires": null,
 *           "httpOnly": true,
 *           "path": "/"
 *       },
 *       "passport": {
 *           "user": 1
 *       }
 *   },
 *   "nickname": "beoms_test",
 *   "testFlag": true,
 *   "socialType": "local"
 *  }
 */
router.post('/login', passport.authenticate('local-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send({
      session: req.session,
      nickname: req.user.nickname,
      testFlag: !!req.user.testIdx,
      socialType: req.user.socialType,
    });
  });
});

/**
 * @api {get} /login/naver 5. Naver Login
 * @apiName login naver
 * @apiGroup 1. User
 *
 * @apiSuccess {JSON} session cookie info & passport - passport.user is session
 * @apiSuccess {string} nickname user nickname
 * @apiSuccess {boolean} testFlag 테스트 했는지 유무 (테스트를 해야 여행지 정보 조회가능)
 * @apiSuccess {string} socialType 소셜타입: 마이페이지에서 로컬 타입만 정보 수정 가능하기 때문
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "session": {
 *       "cookie": {
 *           "originalMaxAge": null,
 *           "expires": null,
 *           "httpOnly": true,
 *           "path": "/"
 *       },
 *       "passport": {
 *           "user": 1
 *       }
 *   },
 *   "nickname": "beoms_test",
 *   "testFlag": true,
 *   "socialType": "naver"
 *  }
 */
router.get('/login/naver', passport.authenticate('naver-signin'));
// naver 로그인 연동 콜백
router.get('/login/naver/callback', passport.authenticate('naver-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send({
      session: req.session,
      nickname: req.user.nickname,
      testFlag: !!req.user.testIdx,
      socialType: req.user.socialType,
    });
  });
});

/**
 * @api {get} /login/kakao 6. Kakao Login
 * @apiName login kakao
 * @apiGroup 1. User
 *
 * @apiSuccess {JSON} session cookie info & passport - passport.user is session
 * @apiSuccess {string} nickname user nickname
 * @apiSuccess {boolean} testFlag 테스트 했는지 유무 (테스트를 해야 여행지 정보 조회가능)
 * @apiSuccess {string} socialType 소셜타입: 마이페이지에서 로컬 타입만 정보 수정 가능하기 때문
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "session": {
 *       "cookie": {
 *           "originalMaxAge": null,
 *           "expires": null,
 *           "httpOnly": true,
 *           "path": "/"
 *       },
 *       "passport": {
 *           "user": 1
 *       }
 *   },
 *   "nickname": "beoms_test",
 *   "testflag": true,
 *   "socialType": "kakao",
 *  }
 */
router.get('/login/kakao', passport.authenticate('kakao-signin'));
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback', passport.authenticate('kakao-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send({
      session: req.session,
      nickname: req.user.nickname,
      testFlag: !!req.user.testIdx,
      socialType: req.user.socialType,
    });
  });
});

/**
 * @api {get} /logout 7. Logout
 * @apiName logout
 * @apiGroup 1. User
 *
 * @apiSuccess {string} message 'logout'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "logout"
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
