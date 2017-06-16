const mongoose = require('mongoose')
const msg = '{PATH} cannot be empty'

let postSchema = mongoose.Schema({
  title: {type: String, required: msg},
  body: {type: String},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: {type: Date, default: Date.now()},
  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answers'}],
  views: {type: Number, default: 0},
  likes: {type: Number, default: 0},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Categories'}
})

let Post = mongoose.model('Posts', postSchema)

module.exports = Post
