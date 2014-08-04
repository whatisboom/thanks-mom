var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queueItemSchema = new Schema({
    text: String,
    hashtags: String
});

module.exports = mongoose.model('queueItem', queueItemSchema);