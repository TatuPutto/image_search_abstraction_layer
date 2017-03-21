const search = require('./search').search;
const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 8080));

app.get('/imagesearch/:searchTerm', (req, res) => {
    const searchTerm = req.params.searchTerm;
    const query = req.query;
    const offset = query.offset;
    const num = query.num;

    const p = search(searchTerm, offset, num)
        .then((data) => res.end(JSON.stringify(data)))
        .catch((err) => res.end(`Query failed: ${err}`));
});

app.listen(app.get('port'));
