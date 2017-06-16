const Post = require('../models/Post')
const dateFormat = require('../utils/dateformat')
const sorter = require('../utils/sorter')

module.exports = {
  get: (req, res) => {
    Post.find().limit(20).populate('author').populate('answers').then(posts => {
      let sorted = sorter(posts)
      res.render('home/home', {posts: sorted, dateFormat})
    }).catch(err => {
      res.status(502).send(err.message || 'Error on our end')
    })
  }
}
