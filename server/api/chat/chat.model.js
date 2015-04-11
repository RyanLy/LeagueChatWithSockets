'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatSchema = new Schema({
  name: String,
  message: String,
  champion: String,
  picture: String,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chat', ChatSchema);