const conStr = 'mongodb://localhost:27017/Forum'
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

require('../models/User')
require('../models/Post')
require('../models/Answer')
require('../models/Category')

module.exports = () => {
  mongoose.connect(conStr)

  let database = mongoose.connection

  database.once('open', () => {
    console.log('db connected')
  })

  database.on('error', err => {
    console.log(err)
  })
}
