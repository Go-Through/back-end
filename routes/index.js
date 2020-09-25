const express = require('express');
const passport = require('passport');

const { authenticateUser } = require('../service/init-module');
const { checkExistId, getTargetUser } = require('../service/manage-user');

const router = express.Router();

/**
 * @api {get} / 1. Before Login Call API (TEST)
 * @apiName before
 * @apiGroup 1. User
 *
 * @apiSuccess {String} message 'fail'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "fail"
 *  }
 */
router.get('/', (req, res, next) => {
  res.send({
    message: 'fail',
  });
});

/**
 * @api {get} /main 2. After Login Call API (TEST)
 * @apiName main
 * @apiGroup 1. User
 *
 * @apiSuccess {String} message 'success'
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
 * @apiDescription 로컬 가입을 위한 API 이다. nickname, id, password, withId 를 받아
 * 서버로 POST 한다.
 *
 * @apiParam {String} nickname Users nickname
 * @apiParam {String} id Users unique ID
 * @apiParam {String} password Users PW
 * @apiParam {Number} [withId] 연결하고자 하는 커플 아이디 get-candidate-id 인덱스 결과
 * @apiParamExample {JSON} Request-Example:
 * {
 *   "nickname": "local1",
 *   "id": "local1",
 *   "password": "a123456",
 *   "withId": 2,
 * }
 *
 * @apiSuccess {String} message 'sign up success'
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
 * @apiDescription 로컬 로그인을 위한 API 이다. id와 password 가 필요하다.
 *
 * @apiParam {String} id Users unique ID
 * @apiParam {String} password Users PW
 * @apiParamExample {JSON} Request-Example:
 * {
 *   "id": "local1",
 *   "password": "a123456"
 * }
 *
 * @apiSuccess {String} nickname user nickname
 * @apiSuccess {Boolean} testFlag 테스트 했는지 유무 (테스트를 해야 여행지 정보 조회가능)
 * @apiSuccess {String} socialType 소셜타입: 마이페이지에서 로컬 타입만 정보 수정 가능하기 때문
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
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
      nickname: req.user.nickname,
      testFlag: !!req.user.testIdx,
      socialType: req.user.socialType,
    });
  });
});

/**
 * @apiIgnore 이용 불가
 * @api {get} /login/naver 5. Naver Login
 * @apiName login naver
 * @apiGroup 1. User
 *
 * @apiDescription API 콜을 하면, Naver sign up, login을 하기 위한 콜백 URL 로 자동 연결되며
 * 회원가입과 동시에 로그인이 진행되고 예시와 같은 결과값을 받을 수 있다.
 *
 * @apiSuccess {String} nickname user nickname
 * @apiSuccess {Boolean} testFlag 테스트 했는지 유무 (테스트를 해야 여행지 정보 조회가능)
 * @apiSuccess {String} socialType 소셜타입: 마이페이지에서 로컬 타입만 정보 수정 가능하기 때문
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "nickname": "beoms_test",
 *   "testFlag": true,
 *   "socialType": "naver"
 *  }
 */
/*
router.get('/login/naver', passport.authenticate('naver-signin'));
// naver 로그인 연동 콜백
router.get('/login/naver/callback', passport.authenticate('naver-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send({
      nickname: req.user.nickname,
      testFlag: !!req.user.testIdx,
      socialType: req.user.socialType,
    });
  });
});
 */

/**
 * @apiIgnore 이용 불가
 * @api {get} /login/kakao 6. Kakao Login
 * @apiName login kakao
 * @apiGroup 1. User
 *
 * @apiDescription API 콜을 하면, Kakao sign up, login을 하기 위한 콜백 URL 로 자동 연결되며
 * 회원가입과 동시에 로그인이 진행되고 예시와 같은 결과값을 받을 수 있다.
 *
 * @apiSuccess {String} nickname user nickname
 * @apiSuccess {Boolean} testFlag 테스트 했는지 유무 (테스트를 해야 여행지 정보 조회가능)
 * @apiSuccess {String} socialType 소셜타입: 마이페이지에서 로컬 타입만 정보 수정 가능하기 때문
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "nickname": "beoms_test",
 *   "testflag": true,
 *   "socialType": "kakao",
 *  }
 */
/*
router.get('/login/kakao', passport.authenticate('kakao-signin'));
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback', passport.authenticate('kakao-signin', {
  failureRedirect: '/',
}), (req, res) => {
  req.session.save(() => {
    res.send({
      nickname: req.user.nickname,
      testFlag: !!req.user.testIdx,
      socialType: req.user.socialType,
    });
  });
});
 */

/**
 * @api {get} /logout 7. Logout
 * @apiName logout
 * @apiGroup 1. User
 *
 * @apiSuccess {String} message 'logout'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "fail"
 *  }
 */
router.get('/logout', (req, res, next) => {
  /* req.logout();
  req.session.save(() => {
    res.send({
      message: 'logout',
    });
  }); */
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.redirect('/');
    } else {
      res.send({
        message: 'logout',
      });
    }
  });
});

/**
 * @api {get} /get-candidate-id 8. Get Candidate ID
 * @apiName get candidate id
 * @apiGroup 1. User
 *
 * @apiDescription API 콜을 통해 아이디에 해당하는 다른 유저들의 후보를 가져올 수 있다.
 *
 * @apiParam {String} targetId 검색하고자 하는 아이디
 *
 * @apiSuccess {Object} Object 검색 아이디 array (디비 인덱스, 아이디, 닉네임, 생성날짜) 반환
 * @apiSuccessExample {Object} Success-Response:
 *  HTTP/1.1 200 OK
 * [
 *    {
 *        "id": 2,
 *        "mem_id": "local2",
 *        "nickname": "local2",
 *        "created_at": "2020-08-24T14:12:06.000Z"
 *    }
 * ]
 */
router.get('/get-candidate-id', async (req, res, next) => {
  let result;
  try {
    const { targetId } = req.query;
    if (targetId) {
      if (req.user) { // 로그인 되어 있는 상태에서 사용하는 경우
        result = await getTargetUser(targetId, req.user.id);
      } else { // 회원가입 시 사용하는 경우
        result = await getTargetUser(targetId);
      }
    } else {
      result = {
        message: 'Input query - targetId',
      };
    }
  } catch (err) {
    console.error('get-candidate-id error');
    console.error(err.message);
    throw err;
  }
  res.send(result);
});

/**
 * @api {get} /chk-exist-id 9. Check Exist ID
 * @apiName chk exist id
 * @apiGroup 1. User
 *
 * @apiDescription 있는 아이디인지 체크할 수 있다.
 *
 * @apiParam {String} chkId 체크할 아이디
 *
 * @apiSuccess {Boolean} message 아이디 있으면 true, 없으면 false
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: true
 *  }
 */
router.get('/chk-exist-id', async (req, res, next) => {
  try {
    const { chkId } = req.query;
    if (!chkId) {
      res.send({
        message: 'Input query - chkId',
      });
      return;
    }
    const chkResult = await checkExistId(chkId);
    res.send({
      message: chkResult,
    });
  } catch (err) {
    console.error('chk-exist-id error');
    console.error(err.message);
    throw err;
  }
});

module.exports = router;
