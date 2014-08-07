var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
    text: String,
    queue: String
});

module.exports = mongoose.model('Tweet', TweetSchema);