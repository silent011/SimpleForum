const errorHandler = require('../utils/error-handler')
const Post = require('../models/Post')
const Answer = require('../models/Answer')
const User = require('../models/User')

module.exports = {
  postAnswer: (req, res) => {
    let postId = req.params.id
    let answerBody = req.body.body
    if (answerBody.length === 0) {
      Post.findById(postId).populate('author').populate('answers').then(post => {
        errorHandler(res, 'Answers cannot be empty', 'posts/single', {post})
      }).catch(err => {
        res.status(404).send('Invalid link')
      })
      return
    }
    let reqAnswer = {
      body: answerBody,
      date: Date.now(),
      author: req.user._id,
      parent: postId
    }

    Answer.create(reqAnswer).then(answer => {
      Post.findById(postId).then(post => {
        post.answers.push(answer._id)
        post.save()

        User.findById(answer.author).then(user => {
          user.answers.push(answer._id)
          user.save()

          res.redirect(`/post/${postId}/${post.title}`)
        })
      })
    }).catch(err => {
      Post.findById(postId).populate('author').populate('answers').then(post => {
        errorHandler(res, err.message || 'Error on our end', 'posts/single', {post})
      }).catch(err => {
        res.status(404).send('Invalid link')
      })
    })
  }
}
