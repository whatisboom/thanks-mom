var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QueueSchema = new Schema({
    name: String
});

module.exports = mongoose.model('QueueItem', QueueSchema);