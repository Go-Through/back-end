# back-end
[![Build Status](http://kntrip.me:8080/buildStatus/icon?job=kn-trip-back-end)](http://kntrip.me:8080/job/kn-trip-back-end/)

For Back End (Server And Database Component)

0. [API DOCS](http://kntrip.me:8000/docs)

1. Express Application Generator
```shell script
npm install express-generator -g
express --view=ejs
npm install
```

2. Sequelize.js
```shell script
npm install sequelize
npm install mysql2
npm install -g sequelize-cli

sequelize init
```

3. Database 생성 (UTF-8 적용)
```
CREATE DATABASE 데이타베이스_이름 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```

4. .gitignore 적용

이미 git 으로 관리하는 파일이라면
```shell script
git rm -r --cached .
```
을 한 뒤 .gitignore 에 추가

5. passport.js
```shell script
npm install --save passport passport-local express-session
```

6.apidoc
```shell script
npm install apidoc -g
apidoc -i routes/ -o doc/
```
DOCS API 추가하기
```javascript
app.use('/docs', express.static(path.join(__dirname, 'doc')));
```