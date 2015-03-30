var mongoose = require('mongoose');

// Define the schema for a user
var event = new mongoose.Schema({
    Speaker: String,
    Title: String,
    BIO: String,
    Position: String,
    Employer: String,
    Name: String,
    Description: String,
    time: Date,
    Room: String,
    Attending: [{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
    }]
});

var events = mongoose.model('event', event);
module.exports = events;