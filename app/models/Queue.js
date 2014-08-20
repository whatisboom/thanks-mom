var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QueueSchema = new Schema({
    name: String,
    hashtags: {
        content: String,
        length: Number
    }
});

module.exports = mongoose.model('Queue', QueueSchema);