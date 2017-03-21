const mongo = require('mongodb').MongoClient;

const mongoUrl = process.env.MONGOLAB_URI_EXT2;

// get latest searches from db
function getLatestSearches() {
    return new Promise((resolve, reject) => {
        mongo.connect(mongoUrl, (err, db) => {
            if(err) reject(err);
            const collection = db.collection('searches');

            collection.find({}, {_id: 0}).sort({_id: -1})
                .limit(50)
                .toArray((err, results) => {
                    if(err) reject(err);
                    resolve(results);
                });
            db.close();
       });
   });
}

// insert new search into db
function insertSearch(searchStr) {
    mongo.connect(mongoUrl, (err, db) => {
        if(err) throw new Error(err);
        const collection = db.collection('searches');

        collection.insert({
            term: searchStr,
            when: new Date()
        }, (err) => {
            if(err) throw new Error(err);
        });
        db.close();
   });
}


module.exports.getLatestSearches = getLatestSearches;
module.exports.insertSearch = insertSearch;
