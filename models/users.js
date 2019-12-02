const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Users = new Schema({
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

})

var user = mongoose.model('ChatUser', Users)


var addUser = (data) => {
    return new Promise((resolve, reject) => {
        var u = new user(data);
        u.save(err => {
            if (err) {
                return reject(err)
            }
            return resolve()
        });
    });
};

var allUsers = () => {
    return new Promise((resolve, reject) => {
        user.find({}, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(data)
        })
    })
}

module.exports = {
    addUser,
    allUsers
}