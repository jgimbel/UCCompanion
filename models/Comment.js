var mongoose = require('mongoose');

// Define the schema for a user
var comment = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    Event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: true
    },
    Comment: String
});

var comments = mongoose.model('comment', comment);
module.exports = comments;