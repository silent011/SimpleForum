const User = require('../models/User')
const errorHandler = require('../utils/error-handler')
const enc = require('../utils/encryption')

module.exports = {
  getReg: (req, res) => {
    res.render('user/register')
  },
  postReg: (req, res) => {
    let passLength = req.body.password.length
    if (passLength === 0) {
      errorHandler(res, 'Password is required', 'user/register'); return
    }

    let salt = enc.generateSalt()
    let reqUser = {
      username: req.body.username,
      salt: salt,
      password: enc.generateHashPass(salt, req.body.password),
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }

    User.create(reqUser).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          errorHandler(res, err, 'user/register', user)
          return
        }

        res.redirect('/')
      })
    }).catch(err => {
      if (err.code === 11000) {
        errorHandler(res, 'Username is already taken', 'user/register', reqUser)
        return
      }

      errorHandler(res, err.message, 'user/register', reqUser)
    })
  },
  getLogin: (req, res) => {
    res.render('user/login')
  },
  postLogin: (req, res) => {
    let reqUser = req.body

    User.findOne({username: reqUser.username}).then(user => {
      let hashed = enc.generateHashPass(user.salt, reqUser.password)
      if (hashed === user.password) {
        req.logIn(user, (err, user) => {
          if (err) {
            errorHandler(res, err.message, 'user/login')
            return
          }

          res.redirect('/')
        })
      } else {
        errorHandler(res, 'Invalid credentials', 'user/login')
      }
    }).catch(err => {
      errorHandler(res, 'Invalid credentials', 'user/login', reqUser)
    })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
