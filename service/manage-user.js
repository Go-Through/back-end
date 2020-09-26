const bcrypt = require('bcrypt');

const { models, isIdValidate, isPasswordValidate } = require('./init-module');

async function checkExistId(checkId) {
  try {
    const sqlResult = await models.users.findOne({
      where: { memID: checkId },
    });
    return !!sqlResult;
  } catch (err) {
    console.error('checkExistId() error');
    console.error(err.message);
    throw err;
  }
}

async function getTargetUser(targetId, userId) {
  const idList = [];
  try {
    const sqlResultSet = await models.users.findAll({
      where: {
        memID: targetId,
        withID: null,
      },
      attributes: ['id', 'mem_id', 'nickname', 'created_at'],
    });
    if (userId) {
      for (const sqlResult of sqlResultSet) {
        if (sqlResult.get().id !== userId) {
          idList.push(sqlResult.get());
        }
      }
    } else{
      for (const sqlResult of sqlResultSet) {
        idList.push(sqlResult.get());
      }
    }
  } catch (err) {
    console.error('getTargetUser() error');
    console.error(err.message);
    throw err;
  }
  return idList;
}

async function updateUserInfo(userInfo, updateObject) {
  if (!isIdValidate(updateObject.id)) return { message: 'ID length error' };
  if (!isPasswordValidate(updateObject.password)) return { message: 'PW length error' };
  const generateHash = (pw) => bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
  try {
    // 다른 아이디일때만 존재하는지 체크
    if (updateObject.id !== userInfo.memID) {
      const sqlResult = await models.users.findOne({
        where: {
          memID: updateObject.id,
          socialType: userInfo.socialType,
        },
      });
      if (sqlResult) {
        return {
          message: 'ID already exists',
        };
      }
    }
    const userPassword = generateHash(updateObject.password);
    const nick = updateObject.nickname;
    const data = {
      nickname: nick,
      memID: updateObject.id,
      memPW: userPassword,
    };
    await models.users.update(data, {
      where: { id: userInfo.id },
    });
    return {
      message: 'success',
    };
  } catch (err) {
    console.error('updateUserInfo() error');
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  checkExistId,
  getTargetUser,
  updateUserInfo,
};
