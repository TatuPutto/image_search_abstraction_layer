const https = require('https');
const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const cx = process.env.cxId;


function doSearch(query, offset, num) {
    // check that offset is within acceptable range
    offset = (typeof offset  !== 'undefined') ?  offset  : 1;
    offset = (offset > 1 || offset < 101) ? offset : 1;

    // check that num is within acceptable range
    num = (typeof num  !== 'undefined') ?  num  : 10;
    num = (num > 0 || num < 11) ? num : 1;

    // form url and query string
    const params = `?key=${apiKey}&cx=${cx}&q=${query}&num=${num}&start=${offset}&searchType=image`;
    const url = 'https://www.googleapis.com/customsearch/v1' + params;

    // using Promise to handle async
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if(res.statusCode !== 200)  {
                return reject(res.statusCode);
            }

            res.setEncoding('utf8');
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                // extract relevant information out of response and resolve promise with it
                const parsedData = JSON.parse(data);
                const relevantInfo = extractRelevantInfo(parsedData.items);
                resolve(relevantInfo);
            });
        });
    });
}


function extractRelevantInfo(items) {
    let relevantImageInfo = [];
    for(let i = 0; i < items.length; i++) {
        let imageObj = {};
        imageObj['url'] = items[i].link;
        imageObj['snippet'] = items[i].snippet;
        imageObj['context'] = items[i].image.contextLink;
        imageObj['thumbnail'] = items[i].image.thumbnailLink;
        relevantImageInfo.push(imageObj);
    }
    return relevantImageInfo;
}

module.exports.search = doSearch;
