var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var QueueSchema = new Schema({
    name: String,
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

QueueSchema.plugin(findOrCreate);

module.exports = mongoose.model('Queue', QueueSchema);