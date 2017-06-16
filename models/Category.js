const mongoose = require('mongoose')
const {Schema} = mongoose
const msg = '{PATH} is required'

let categorySchema = Schema({
  name: {type: String, required: msg, unique: true},
  posts: [{type: Schema.Types.ObjectId, ref: 'Posts'}]
})

let Category = mongoose.model('Categories', categorySchema)

module.exports = Category
