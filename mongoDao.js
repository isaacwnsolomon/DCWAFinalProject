const MongoClient = require('mongodb').MongoClient
let db, coll;

MongoClient.connect('mongodb://127.0.0.1:27017')
.then((client) => {
    db = client.db('proj2024MongoDB')
    coll = db.collection('lecturers')
})
.catch((error) => {
    console.log(error.message)
})

var findAll = function() {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
        .then((documents) => {
            resolve(documents)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

const deleteLecturer = function (lecturerId) {
    return new Promise((resolve, reject) => {
        if (!coll) {
            reject("Collection not initialized");
            return;
        }

        // Update to match on _id field directly since it's a string
        coll.deleteOne({ _id: lecturerId })  // Changed from lecturerId to _id
            .then((result) => {
                console.log("Delete result:", result); // Debug log
                if (result.deletedCount === 0) {
                    reject("No lecturer found with ID: " + lecturerId);
                } else {
                    resolve();
                }
            })
            .catch((error) => {
                console.log("MongoDB delete error:", error);
                reject(error);
            });
    });
};

module.exports = { deleteLecturer, findAll };