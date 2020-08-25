const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { getMyPlace } = require('../service/manage-trip');
const { getCommonInfo } = require('../service/detail-info');

const router = express.Router();

/**
 * @api {get} /trip-info 1. Trip Info
 * @apiName trip info
 * @apiGroup 3. Trip
 *
 * @apiParam order 정렬 순서 선택 0-count, 1-bascket, 2-title
 *
 * @apiSuccess {JSON} Info 추천여행지 정보
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "items": [
 *       {
 *           "image": "http://tong.visitkorea.or.kr/cms/resource/41/2023841_image2_1.jpg",
 *           "title": "청계산",
 *           "address": "서울특별시 서초구 원터길",
 *           "contentID": 125452,
 *           "cotentTypeID": 12,
 *           "placeCount": 0,
 *           "placeHeart": 0
 *       },
 *       ...
 *   ],
 *   totalCount: 145
 *  }
 */
router.get('/', authenticateUser, async (req, res, next) => {
  let tripInfoResult;
  try {
    // eslint-disable-next-line max-len
    tripInfoResult = await getMyPlace(req.user.id, parseInt(req.query.order, 10));
  } catch (err) {
    console.error('trip info error');
    console.error(err.message);
    throw err;
  }
  res.send(tripInfoResult);
});

/**
 * @api {get} /trip-info/detail/:contentId 2. Detail Info
 * @apiName detail info
 * @apiGroup 3. Trip
 *
 * @apiParam contentId 컨텐츠 아이디 (Tour API)
 * @apiParam contentTypeId 컨텐츠 타입 (Tour API)
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "babycarriageRent": "가능",
 *   "creditcardAvailable": "없음",
 *   "petAvailable": "불가",
 *   "infocenterNumber": "02-2124-5248",
 *   "parkingInfo": "주차 가능(지하주차장 125대)<br />\n※ 버스 차량 주차 불가",
 *   "parkingFee": "5분당 200원",
 *   "restDateInfo": "매주 월요일, 1월 1일",
 *   "spendTime": "약 2~3시간",
 *   "useFee": "무료",
 *   "usetimeInfo": "[평일] 10:00~20:00<br />\n[토,일,공휴일]<br />\n하절기(3~10월) 10:00~19:00<br />\n동절기(11~2월) 10:00~18:00<br />\n\n<br />\n* 관람 종료 1시간 전까지 입장 가능",
 *   "area": "서울 노원구",
 *   "title": "서울시립 북서울미술관",
 *   "address": "서울특별시 노원구 동일로 1238 (중계동)",
 *   "heart": false,
 *   "introStr": "<b>※ 코로나바이러스감염증-19 공지사항<br>※ 내용 : 임시휴관(2020.08.19.~)</b><br><u><a href=\"https://korean.visitkorea.or.kr/notice/news_detail.do?nwsid=8cdd65e1-59f1-4904-8bc9-884001e40911\" title=\"여행정보 변동사항 페이지로 이동\">→ 코로나바이러스감염증-19 여행정보 변동사항 확인하기</a></u><br><br>서울특별시 노원구 중계동에 위치한 서울시립 북서울미술관은 연면적 17,113㎡, 지상 3층/지하 3층의 구조로 되어 있다. 지상 1, 2층에 총 4개의 대형 전시실이 마련되어있어 연중 기획전시가 개최 되고, 지하 1층에 어린이 갤러리에서는 어린이들을 위한 상설전이 이루어진다. 또한 시민의 특성과 요구를 반영한 맞춤형 교육 프로그램과 다양한 문화예술 프로그램을 실시하여 관객에게 복합적인 문화예술 경험의 기회를 제공한다.<br>",
 *   "mapx": 127.0668386402,
 *   "mapy": 37.6406499975,
 *   "homepage": "<a href=\"http://sema.seoul.go.kr/\"target=\"_blank\" title=\"새창: 서울시립미술관\">http://sema.seoul.go.kr/</a>",
 *   "firstimage": "http://tong.visitkorea.or.kr/cms/resource/61/2030361_image2_1.jpg",
 *   "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/61/2030361_image3_1.jpg"
 *  }
 */
router.get('/detail', authenticateUser, async (req, res, next) => {
  let detailInfo;
  try {
    const { contentId, contentTypeId } = req.query;
    if (!contentId || !contentTypeId) {
      res.send('Input query params. contentId, contentTypeId');
    }
    // eslint-disable-next-line max-len
    detailInfo = await getCommonInfo(req.user.id, parseInt(contentId, 10), parseInt(contentTypeId, 10));
  } catch (err) {
    console.error('detail info error');
    console.error(err.message);
    throw err;
  }
  res.send(detailInfo);
});

// 추천하는 장소용: query로 위도, 경도 필요 (location based 쓸 예정)
/**
 * @api {get} /location 3. Recommend Location
 * @apiName recommend location
 * @apiGroup 3. Trip
 *
 * @apiParam locationX
 * @apiParam locationY
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/location', authenticateUser, async (req, res, next) => {
});

// 시군구 위치에 따른 여행지 추천, query로 areaCode, sigungu Code 필요 (area Based)
/**
 * @api {get} /place 4. Area Based Place
 * @apiName area based place
 * @apiGroup 3. Trip
 *
 * @apiParam areaCode
 * @apiParam [sigunguCode] optional
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/place', authenticateUser, async (req, res, next) => {
});

// 근처 숙소 필요
/**
 * @api {get} /room 5. Room Place
 * @apiName room place
 * @apiGroup 3. Trip
 *
 * @apiParam areaCode
 * @apiParam [sigunguCode] optional
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/room', authenticateUser, async(req, res, next) => {
});

module.exports = router;
