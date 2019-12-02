const MongoClient = require('mongodb').MongoClient;


var init = () => {


    MongoClient.connect('mongodb://127.0.0.1:27017', {
        useNewUrlParser: true
    }, (err, client) => {
        if (err) {
            console.error(err)
        } else {
            console.log("Connected To DB")

        }
        var db = client.db('chat')

    })
}
module.exports = {
    init
}