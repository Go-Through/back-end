const crypto = require('crypto');

function makeKey() {
  return crypto.randomBytes(16).toString('base64');
}
