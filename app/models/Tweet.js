var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var TweetSchema = new Schema({
    text: String,
    queue: {
        _id: String
    }
});

TweetSchema.plugin(findOrCreate);

module.exports = mongoose.model('Tweet', TweetSchema);