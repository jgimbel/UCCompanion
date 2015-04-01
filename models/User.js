var mongoose = require('mongoose');

// Define the schema for a user
var user = new mongoose.Schema({
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    friends: [String]
});
user.methods.ConnectedFriends = function(callback) {
    mongoose.models["user"].or([{
        'facebook.id': {
            $in: this.friends
        }
    }, {
        friends: {
            $elemMatch: {
                $eq: this.facebook.id
            }
        }
    }]).distinct('_id', callback);
}
var users = mongoose.model('user', user);
module.exports = users;