const axios = require('axios')
const configApi = require('../models/apiModel')

async function fetchData(start, end) {
    try {
        const { apiKey, apiUrl, locationId, datasetId, datatypeId, stationId , units} = configApi;
        const limit = 1000

        const params = {
            datasetid: datasetId,
            locationid: locationId,
            datatypeid: datatypeId,
            stationid: stationId,
            units: units,
            startdate: start,
            enddate: end,
            limit: limit,
        }
        const headers = {
            'Content-Type': 'application/json',
            token: apiKey
        }

        const response = await axios.get(apiUrl, { params: params, headers: headers})
        const data = response.data.results

        return data
    }
    catch(error) {
          // Xử lý lỗi 429: Thử lại yêu cầu sau một khoảng thời gian
        if (error.response && error.response.status === 429) {
            console.log('Request limit exceeded. Waiting for a moment before retrying...');
            await new Promise(resolve => setTimeout(resolve, 6000)); // Chờ 1 giây trước khi thử lại yêu cầu
            return fetchData(start, end); // Thử lại yêu cầu
        } else {
            console.error('Error fetching data:', error);
            throw error; // Ném lỗi lại để xử lý ở phía khác
        }
    }
}

async function fetchDataForRange(startDate, endDate) {
    const promises = []
    for(let year = startDate; year <= endDate; year++) {
        const start = year + '-01-01'
        const end = year + '-12-31'
        promises.push(fetchData(start, end))
    }
    const results = await Promise.all(promises);
    console.log(results);
    return results;
}
module.exports = fetchDataForRange