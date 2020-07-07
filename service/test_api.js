const axios = require('axios');
const fs = require('fs');

const url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService';
const service = 'areaCode';
const dataResult = JSON.parse(fs.readFileSync('../service-key.json', 'utf8'));

axios.get(`${url}/${service}`, {
    params: {
        ServiceKey: dataResult.key,
        numOfRows: '100',
        pageNo: '1',
        MobileOS: 'ETC',
        MobileApp: 'AppTest',
        _type: 'json',
        areaCode: '1'
    }
}).then(function (result) {
    console.log(result.data);
});