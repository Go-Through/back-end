const crypto = require('crypto');

module.exports = {
  generateKey: () => crypto.randomBytes(16).toString('base64'),
};
