const Category = require('../models/Category')
const Post = require('../models/Post')

module.exports = {
  getAdd: (req, res) => {
    res.render('category/add')
  }
}
