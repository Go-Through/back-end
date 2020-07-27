const { connectDB } = require('../service/init-module');
const { createTourInfo } = require('./collect-tour-code');

function tourScheduling() {
  // eslint-disable-next-line no-unused-vars
  let scheduler = setTimeout(async function tick() {
    console.log('Tour API Update Start!');
    createTourInfo()
      .then(() => {
        console.log('Tour API Update Complete!');
        scheduler = setTimeout(tick, 60000 * 60 * 24 * 10); // 10일에 한번씩
      })
      .catch((e) => {
        console.error('tourScheduling() error');
        console.error(e.message);
      });
  }, 0);
}

connectDB()
  .then(async () => {
    tourScheduling();
  });
