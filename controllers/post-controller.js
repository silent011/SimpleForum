const Post = require('../models/Post')
const errorHandler = require('../utils/error-handler')
const dateFormat = require('../utils/dateformat')
const User = require('../models/User')
const sorter = require('../utils/sorter')

module.exports = {
  getAdd: (req, res) => {
    res.render('posts/add')
  },
  postAdd: (req, res) => {
    let title = req.body.title

    if (title.length === 0) {
      errorHandler(res, 'Title cannot be empty', 'posts/add')
      return
    }

    let reqPost = {
      title,
      body: req.body.body,
      author: req.user._id,
      date: Date.now(),
      likes: 0,
      views: 0
    }

    Post.create(reqPost).then(post => {
      User.findById(req.user._id).then(user => {
        user.posts.push(post._id)
        user.save()

        res.redirect('/')
      })
    }).catch(err => {
      errorHandler(res, err.message || 'Problem on our end', 'home/home')
    })
  },
  listAll: (req, res) => {
    Post.find().populate('author').populate('answers').then(posts => {
      let page = req.query.page || 1

      let sorted = sorter(posts)
      let pages = Math.ceil(sorted.length / 2)

      let minPage = (page - 1) * 2
      let maxPage = page * 2
    //   if (maxPage > sorted.length) maxPage = sorted.length

      sorted = sorted.slice(minPage, maxPage)

      res.render('posts/list', {posts: sorted, dateFormat, pages, n: 1})
    }).catch(err => {
      errorHandler(res, err.message || 'Problem on our end', 'home/home')
    })
  },
  getSingle: (req, res) => {
    let postId = req.params.id

    Post.findById(postId).populate('author').populate({
      path: 'answers',
      populate: {
        path: 'author'
      }
    }).then(post => {
      post.views++
      post.save().then(() => {
        res.render('posts/single', {post, dateFormat})
      }).catch(err => {
        res.status(404).send('Invalid link')
      })
    }).catch(err => {
      res.status(404).send('Invalid link')
    })
  },
  postLike: (req, res) => {
    let id = req.params.id
    let title = req.params.title
    if (!id && !title) {
      res.status(404).send('Invalid link')
      return
    }

    Post.findById(id).then(post => {
      User.findById(req.user._id).then(user => {
        if (user.likedPosts.indexOf(post._id) !== -1) {
          res.redirect(`/post/${id}/${title}`)
          return
        }
        post.likes++
        post.save()
        user.likedPosts.push(post._id)
        user.save().then(() => {
          res.redirect(`/post/${id}/${title}`)
        }).catch(err => {
          res.status(404).send(err.message || 'something went wrong')
        })
      })
    }).catch(err => {
      res.status(404).send(err.message || 'something went wrong')
    })
  },
  dislikePost: (req, res) => {
    let id = req.params.id
    let title = req.params.id

    if (!id && !title) {
      res.status(404).send('Invalid link')
      return
    }

    Post.findById(id).then(post => {
      User.findById(req.user._id).then(user => {
        let index = user.likedPosts.indexOf(post._id)
        if (index === -1) {
          res.redirect(`/post/${id}/${title}`)
          return
        }

        post.likes--
        post.save()
        user.likedPosts.splice(index, 1)
        user.save().then(() => {
          res.redirect(`/post/${id}/${title}`)
        }).catch(err => {
          res.status(404).send(err.message || 'something went wrong')
        })
      })
    }).catch(err => {
      res.status(404).send(err.message || 'something went wrong')
    })
  }
}
