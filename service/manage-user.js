const bcrypt = require('bcrypt');

const { models, isIdValidate, isPasswordValidate } = require('./init-module');

async function getTargetUser(targetId) {
  const idList = [];
  try {
    const sqlResultSet = await models.users.findAll({
      where: {
        memID: targetId,
      },
      attributes: ['id', 'mem_id', 'nickname', 'created_at'],
    });
    for (const sqlResult of sqlResultSet) {
      idList.push(sqlResult.get());
    }
  } catch (err) {
    console.error('getTargetUser() error');
    console.error(err.message);
    throw err;
  }
  return idList;
}

async function updateUserInfo(userId, socialType, updateObject) {
  if (!isIdValidate(updateObject.id)) return { message: 'ID length error' };
  if (!isPasswordValidate(updateObject.password)) return { message: 'PW length error' };
  const generateHash = (pw) => bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
  models.users.findOne({
    where: {
      memID: updateObject.id,
      socialType: 'local',
    },
  }).then((sqlResult) => {
    if (sqlResult) {
      return {
        message: 'ID already exists',
      };
    }
    const userPassword = generateHash(updateObject.password);
    const nick = updateObject.nickname;
    const data = {
      nickname: nick,
      memID: updateObject.id,
      memPW: userPassword,
    };
    models.users.update(data, {
      where: { id: userId },
    });
    return 'success';
  });
  return 'fail';
}

module.exports = {
  getTargetUser,
  updateUserInfo,
};
