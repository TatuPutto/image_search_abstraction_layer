const search = require('./search').search;
const getLatestSearches = require('./dbactions').getLatestSearches;
const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/imagesearch/:searchStr', (req, res) => {
    const searchStr = req.params.searchStr;
    const query = req.query;
    const offset = query.offset;
    const num = query.num;

    const p = search(searchStr, offset, num)
        .then((data) => res.end(JSON.stringify(data)))
        .catch((err) => res.end(`Search failed: ${err}`));
});

app.get('/latest', (req, res) => {
    const p = getLatestSearches()
        .then((data) => res.end(JSON.stringify(data)))
        .catch((err) => res.end(`Could not retrieve latest searches: ${err}`));
});

app.listen(app.get('port'));
