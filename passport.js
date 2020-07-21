const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { users } = require('./models');

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출
    console.log('세션에 기록하기');
    done(null, user); // 여기의 user 가 deserializeUser 의 첫 번째 매개 변수로 이동
  }); // 세션에 id 값 저장

  passport.deserializeUser((user, done) => { // 매개변수 user 는 serializeUser의 done의 인자 user를 받은 것
    console.log('세션에서 사용자 정보 읽기');
    done(null, user);
  });

  passport.use('local-signup', new LocalStrategy({ // local 전략 세움
    usernameField: 'id',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, id, password, done) => {
    const generateHash = (pw) => bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
    users.findOne({
      where: {
        memID: id,
      },
    }).then((user) => {
      if (user) {
        return done(null, false, {
          message: '아이디가 이미 존재합니다',
        });
      }
      const userPassword = generateHash(password);
      const data = {
        nickname: req.body.nickname,
        memID: id,
        memPW: userPassword,
      };
      users.create(data).then((newUser) => {
        if (!newUser) {
          return done(null, false);
        }
        return done(null, newUser);
      });
    });
  }));

  // Local Sign-in
  passport.use('local-signin', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: true,
    passReqToCallback: false,
  }, (id, password, done) => {
    const isValidPassword = (userPass, pw) => bcrypt.compareSync(pw, userPass);
    users.findOne({
      where: {
        memID: id,
      },
    }).then((user) => {
      if (!user) {
        return done(null, false, {
          message: 'ID does not exist',
        });
      }
      if (!isValidPassword(user.password, password)) {
        return done(null, false, {
          message: 'Incorrect password',
        });
      }
      const userInfo = user.get();
      return done(null, userInfo);
    }).catch((err) => {
      console.error(err.message);
      return done(null, false, {
        message: 'Something went wrong with your sign in',
      });
    });
  }));
};
