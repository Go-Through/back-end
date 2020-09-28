const { models } = require('./init-module');

// Event 왔는지 확인 (로그인 했을 때) // 연결 요청이 왔습니다!
async function checkEvent(userInfo) {
  const eventId = userInfo.withEvent; // 커플 요청 들어왔을 때
  let result;
  try {
    if (eventId) {
      const sqlResult = await models.users.findOne({
        where: {
          id: eventId,
        },
        attributes: ['id', 'mem_id'],
      });
      if (sqlResult) {
        result = sqlResult.get();
        result.message = 'connect';
      } else {
        result = {
          message: 'not user',
        };
      }
    }
  } catch (err) {
    console.error('checkEvent() error');
    console.error(err.message);
    throw err;
  }
  return result;
}

// 연결을 요청했습니다!
async function connectCouple(userId, targetId, connectOption, tx) {
  try {
    // 이벤트 등록해줌
    const eventParams = { withEvent: userId };
    // 커플 등록 해제 이벤트 targetId 에 userId 가 커플 해제 요청했다는 이벤트 등록, 해제는 해제하는 순간 바로
    if (connectOption === false) {
      eventParams.withID = null;
      eventParams.withEvent = null;
      eventParams.userPlaces = null;
    }
    // 커플 등록 이벤트 - targetId에 userId가 커플 요청했다는 이벤트 등록
    if (tx) { // 회원가입하면서 할때 지금은 disable
      await models.users.update(eventParams, {
        where: { id: targetId },
        transaction: tx,
      });
      await tx.commit();
    } else {
      if (connectOption === true) {
        await models.users.update(eventParams, {
          where: { id: targetId },
        });
      } else {
        await models.users.update(eventParams, {
          where: { id: [userId, targetId] },
        });
      }
    }
  } catch (err) {
    if (tx) { await tx.rollback(); }
    console.error('connectCouple() error');
    console.error(err.message);
    throw err;
  }
  return {
    message: 'post event success',
  };
}

// 수락하기 or 거절하기
async function dealWithEvent(userInfo, eventOption) {
  const userId = userInfo.id;
  const eventId = userInfo.withEvent;
  const tx = await models.sequelize.transaction();
  try {
    // 수락하기
    if (eventOption === true) {
      // 커플 등록 (withId 에 커플 user idx 들어갈 예정)
      await models.users.update({
        withID: eventId,
        withEvent: null,
        userPlaces: null,
      }, {
        where: { id: userId },
        transaction: tx,
      });
      await models.users.update({
        withID: userId,
        withEvent: null,
        userPlaces: null,
      }, {
        where: { id: eventId },
        transaction: tx,
      });
    } else { // 거절하기 - 이벤트 없애줌.
      await models.users.update({
        withEvent: null,
      }, {
        where: { id: eventId },
        transaction: tx,
      });
    }
    if (tx) { await tx.commit(); }
    return {
      message: 'connect success',
    };
  } catch (err) {
    if (tx) { await tx.rollback(); }
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
