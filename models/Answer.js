const mongoose = require('mongoose')
const msg = '{PATH} is required'

let answerSchema = {
  body: {type: String, required: msg},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: {type: Date, default: Date.now()},
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Posts'}
}

let Answer = mongoose.model('Answers', answerSchema)

module.exports = Answer
