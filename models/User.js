const mongoose = require('mongoose')
const enc = require('../utils/encryption')
const msg = '{PATH} is required'

let userSchema = mongoose.Schema({
  username: {type: String, unique: true, required: msg},
  password: {type: String, required: true},
  roles: [{type: String}],
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Posts'}],
  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answers'}],
  firstName: {type: String},
  lastName: {type: String},
  salt: {type: String},
  likedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Posts'}]
})

userSchema.methods.authenticate = function (pass) {
  if (enc.generateHashPass(this.salt, pass) === this.password) {
    console.log(this.salt)
    return true
  }
  return false
}

let User = mongoose.model('User', userSchema)

module.exports = User
