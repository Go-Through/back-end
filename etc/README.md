# Project Study

1. Session

쿠키: 웹 브라우저에 저장되는 키-밸류 타입 데이터, 누구나 키에 따른 밸류 확인 가능
- 비밀 정보 쿠키로 보낸다면 비밀 정보 쉽게 탈취 가능.

세션: 쿠키와 달리 서버에 데이터를 저장하고 웹 브라우저는 Session ID 만을 가지고 있음.

1. 서버는 웹 브라우저에게 세션 값 보내줌. (sid)
2. 클라이언트는 접속할 때 자신이 가지고 있는 sid 를 서버에게 전달.
3. 서버는 클라이언트가 보내준 sid 를 가지고, 해당 유저를 식별.
```javascript
app.use(session({
  secret: 'keybord cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));
```
secret 은 keybord cat으로 랜덤한 값 입력, 공개 X

resave 는 세션을 다시 저장하냐, saveUninitialized는 초기화하냐 정도 옵션

2. CORS 허용

Cross Origin Resource Sharing 의 약자, 현재 도메인과 다른 도메인으로 리소스가 요청될 경우를 말함.

cross-origin HTTP 요청에 의해 요청, 보안 상 이유로 브라우저는 CORS 제한

SPA (Single Page Application) 의 경우에는, RESTful API 기반으로 비동기 네트워크 통신 하기 때문에 API 서버와 웹 페이지 서버 다를 수 있음. 이런 경우 CORS 제한 걸림

Access-Control-Allow-Origin: 서버의 응답 헤더 변경, CORS 허용해줄 도메인 입력.

모든 곳에서 CORS 허용하기 위해서는 모두를 의미하는 * 입력

Express CORS 미들웨어 적용해 CORS 허용하자.

3. OAuth 2.0

- 기존에 사용하던 타사 정보 이용해 로그인 진행
- 타사에서 사용하고 있는 서비스들에 대한 정보 가져와 가공해 가치있는 결과물 사용자에게 제공

일반 로그인은 아이디와 비밀번호 통한 인증 (Authentication), OAuth2.0 은 타사 서비스의 이메일 정보에 우리가 만든 서비스의 접근 허락 (Authorization) 하여 사용자 인증 (Authenticaion)

Client: 사용자가 사용하려는 우리가 만든 서비스

Resource Server: 서비스에 자신의 API 를 제공하는 타사 서비스

Resource Owner: 타사 서비스 API 정보의 주인, 우리가 만든 서비스를 타사 서비스를 통해 이용하려는 사용자

1. Resource Server API 사용 위해 Resource Server 에 등록, Resource Server 는 Client 식별할 수 있는 Client ID, Client Secret 발급

2. Resource Owner 가 우리가 만든 Client 에서 Google 계정으로 로그인을 통해 로그인을 요청

3. Client 는 Resource Owner 에게 Resource Server 의 로그인 창을 띄어줌.

4. Resource Owner 는 Client 가 Resource Server 에 있는 자신의 정보에 접근에 대한 동의를 구하는 창을 보고 동의를 함.

5. Resource Owner 가 Client 에게 Resource Server 에 있는 자신의 정보에 접근 허락 시 Resource Server 는 Client 에게 일련의 암호화 코드를 제공하고 
이 코드와 함께 해당 정보의 사용 등록을 했는지의 여부를 판단하는 Client ID 와 Client Secret 함께 보내 모든 것이 일치한다면 최종 접근 권한 부여 암호인 Access Token 발급