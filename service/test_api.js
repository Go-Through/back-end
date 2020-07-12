const axios = require('axios');
const fs = require('fs');

const url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService';
const dataResult = JSON.parse(fs.readFileSync('../service-key.json', 'utf8'));
const baseParams = {
    params: {
        ServiceKey: dataResult.key,
        numOfRows: '100',
        pageNo: '1',
        MobileOS: 'ETC',
        MobileApp: 'AppTest',
        _type: 'json',
    }
};

async function getFullLocation() {
    const service = 'areaCode';
    const areaFirsts = [];
    const areas = [];

    let axiosResult;
    axiosResult = await axios.get(`${url}/${service}`, baseParams);

    if (axiosResult.data.response.header.resultCode === '0000') {
        for (const item of axiosResult.data.response.body.items.item) {
            areaFirsts.push(item);
            areas.push(item);
        }
        console.log(areaFirsts);
    }

    for (const area of areaFirsts) {
        baseParams.params.areaCode = area.code;
        axiosResult = await axios.get(`${url}/${service}`, baseParams);
        if (axiosResult.data.response.header.resultCode === '0000') {
            if (!Array.isArray(axiosResult.data.response.body.items.item)) {
                axiosResult.data.response.body.items.item.firstArea = area.name;
                areas.push(axiosResult.data.response.body.items.item);
            } else {
                for (const item of axiosResult.data.response.body.items.item) {
                    item.firstArea = area.name;
                    areas.push(item);
                }
            }
            console.log(areas);
        }
        else {
            console.log(`axios Problem - ${axiosResult.data.response.header}`);
        }
    }

}

getFullLocation().then();