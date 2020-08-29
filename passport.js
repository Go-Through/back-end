const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const fs = require('fs');

const { models, isIdValidate, isPasswordValidate } = require('./service/init-module');
const { connectCouple } = require('./service/manage-couple');

const { users } = models;

const authConfig = JSON.parse(fs.readFileSync(`${__dirname}/config/federated.json`, 'utf8'));

function loginByThirdparty(info, done) {
  users.findOne({
    where: {
      memID: info.auth_id,
      socialType: info.auth_type,
    },
  }).then((sqlResult) => {
    if (sqlResult) {
      const userInfo = sqlResult.get();
      return done(null, userInfo);
    }
    // 신규 유저 회원 가입
    users.create({
      nickname: info.auth_nickname,
      memID: info.auth_id,
      socialType: info.auth_type,
      email: info.auth_email,
      image: info.auth_image,
    }).then((sqlCreateResult) => {
      const userInfo = sqlCreateResult.get();
      return done(null, userInfo);
    });
  });
}

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출
    console.log('serializeUser');
    done(null, user.id); // 여기의 user 가 deserializeUser 의 첫 번째 매개 변수로 이동
  });

  passport.deserializeUser(async (id, done) => { // 매개변수 user 는 serializeUser의 done의 인자 user를 받은 것
    try {
      const sqlResult = await users.findOne({
        where: { id: id },
      });
      const userInfo = sqlResult.get();
      console.log('deserializeUser');
      done(null, userInfo);
    } catch (err) {
      console.error('deserialize() error');
      console.error(err.message);
      throw err;
    }
  });

  // Local Sign-up
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  }, (req, id, password, done) => {
    if (!isIdValidate(id)) return done(null, false, { message: 'ID length error' });
    if (!isPasswordValidate(password)) return done(null, false, { message: 'PW length error' });
    const generateHash = (pw) => bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
    users.findOne({
      where: {
        memID: id,
        socialType: 'local',
      },
    }).then((user) => {
      if (user) {
        return done(null, false, {
          message: 'ID already exists',
        });
      }
      const userPassword = generateHash(password);
      const nick = req.body.nickname;
      const coupleId = req.body.withId;
      const data = {
        nickname: nick,
        memID: id,
        memPW: userPassword,
        socialType: 'local',
      };
      users.create(data).then(async (newUser) => {
        if (!newUser) {
          return done(null, false);
        }
        await connectCouple(id, coupleId, true);
        return done(null, newUser.get());
      });
    });
  }));

  // Local Sign-in
  passport.use('local-signin', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: true,
  }, (id, password, done) => {
    if (!isIdValidate(id)) return done(null, false, { message: 'ID length error' });
    if (!isPasswordValidate(password)) return done(null, false, { message: 'PW length error' });
    const isValidPassword = (userPass, pw) => bcrypt.compareSync(pw, userPass);
    users.findOne({
      where: {
        memID: id,
        socialType: 'local',
      },
    }).then((sqlResult) => {
      if (!sqlResult) {
        return done(null, false, {
          message: 'ID does not exist',
        });
      }
      const userInfo = sqlResult.get();
      if (!isValidPassword(userInfo.memPW, password)) {
        return done(null, false, {
          message: 'Incorrect password',
        });
      }
      return done(null, userInfo);
    }).catch((err) => {
      console.error(err.message);
      return done(null, false, {
        message: 'Something went wrong with your sign in',
      });
    });
  }));

  // accessToken: OAuth token 이용해 오픈 API 호출
  // refreshToken: token 만료됐을 때 재발급 요청
  // profile: 사용자 정보
  // naver sign in
  passport.use('naver-signin', new NaverStrategy({
    clientID: authConfig.naver.clientID,
    clientSecret: authConfig.naver.clientSecret,
    callbackURL: authConfig.naver.callbackURL,
    session: true,
  }, (accessToken, refreshToken, profile, done) => {
    const _profile = profile._json;

    return loginByThirdparty({
      auth_type: 'naver',
      auth_id: _profile.id,
      auth_email: _profile.email,
      auth_nickname: _profile.nickname,
      auth_image: _profile.profile_image,
    }, done);
  }));

  // kakao sing in
  passport.use('kakao-signin', new KakaoStrategy({
    clientID: authConfig.kakao.clientID,
    callbackURL: authConfig.kakao.callbackURL,
    session: true,
  }, (accessToken, refreshToken, profile, done) => {
    const _profile = profile._json;

    return loginByThirdparty({
      auth_type: 'kakao',
      auth_nickname: _profile.properties.nickname,
      auth_id: _profile.id,
      auth_email: _profile.kakao_account.email,
      auth_image: _profile.properties.profile_image,
    }, done);
  }));
};
