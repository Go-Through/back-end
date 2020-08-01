const { callService } = require('./init-module');

/*
{
  id: [int]
  test: {
    location: [Array Type],
      concept: [Array Type],
  }
}
*/
// Test 등록하는 함수 - 유저 정보에도 입력하고, location 의 경우 도시 테이블에도 결과 반영해줘야한다.
async function enrollTest(userIdx, testObject) {


}

module.exports = {
  enrollTest,
};
