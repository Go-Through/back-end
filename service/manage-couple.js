const { models } = require('./init-module');

// Event 왔는지 확인 (로그인 했을 때나 마이페이지 접속 시) // 연결 요청이 왔습니다! 또는 해제
async function checkEvent(userInfo) {
  const userId = userInfo.id;
  const eventId = userInfo.withEvent;
  try {
    // 커플 해제
    if (eventId === 0) {
      await models.users.update({
        withID: null,
        withEvent: null,
        userPlaces: null,
      }, {
        where: { id: userId },
      });
      return 'disconnect';
    }
  } catch (err) {
    console.error('checkEvent() error');
    console.error(err.message);
    throw err;
  }
  return eventId;
}

// 연결을 요청했습니다!
async function connectCouple(userId, targetId, connectOption) {
  try {
    // 이벤트 등록해줌
    const eventParams = { withEvent: userId };
    // 커플 등록 해제 이벤트 targetId 에 userId 가 커플 해제 요청했다는 이벤트 등록, 해제 이벤트 있을 시 자동으로 처리
    if (!connectOption) {
      eventParams.withEvent = 0;
    }
    // 커플 등록 이벤트 - targetId에 userId가 커플 요청했다는 이벤트 등록
    await models.users.update(eventParams, {
      where: {
        id: targetId,
      },
    });
  } catch (err) {
    console.error('enrollCouple() error');
    console.error(err.message);
    throw err;
  }
  return 'success';
}

// 수락하기 or 거절하기
async function dealWithEvent(userInfo, eventOption) {
  const userId = userInfo.id;
  const eventId = userInfo.withEvent;
  try {
    // 수락하기
    if (eventOption) {
      // 커플 등록 (withEvent 에 커플 user idx 들어갈 예정)
      await models.users.update({
        withID: eventId,
        withEvent: null,
        userPlaces: null,
      }, {
        where: { id: [userId, eventId] },
      });
    } else { // 거절하기 - 이벤트 없애줌.
      await models.users.update({
        withEvent: null,
      }, {
        where: { id: eventId },
      });
    }
  } catch (err) {
    console.error('dealWithEvent() error');
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  checkEvent,
  connectCouple,
  dealWithEvent,
};
