var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queueItemSchema = new Schema({
    name: String,
    text: String,
    hashtags: String
});

module.exports = mongoose.model('queueItem', queueItemSchema);