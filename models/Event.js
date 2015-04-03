var mongoose = require('mongoose');

// Define the schema for a user
var event = new mongoose.Schema({
    Speaker: String,
    Title: String,
    Bio: String,
    Position: String,
    Company: String,
    Name: String,
    Description: String,
    Time: String,
    Room: String,
    Attending: [{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
    }]
});

var events = mongoose.model('event', event);
module.exports = events;
