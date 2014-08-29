var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QueueSchema = new Schema({
    name: String,
    account: String,
    hashtags: {
        content: String,
        length: Number
    },
    interval: String,
    dayOfWeek: Number,
    hourOfDay: Number,
    minuteOfHour: Number,
    secondOfMinute: Number
});

module.exports = mongoose.model('Queue', QueueSchema);