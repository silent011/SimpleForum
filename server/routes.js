const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.get)

  app.get('/user/register', auth.isNotAuth, controllers.user.getReg)
  app.post('/user/register', auth.isNotAuth, controllers.user.postReg)

  app.get('/user/login', auth.isNotAuth, controllers.user.getLogin)
  app.post('/user/login', auth.isNotAuth, controllers.user.postLogin)

  app.get('/user/logout', auth.isAuth, controllers.user.logout)

  app.get('/add', auth.isAuth, controllers.posts.getAdd)
  app.post('/add', auth.isAuth, controllers.posts.postAdd)

  app.get('/list', controllers.posts.listAll)

  app.get('/post/:id/:title', controllers.posts.getSingle)
  app.post('/post/:id/:title', auth.isAuth, controllers.answer.postAnswer)

  app.get('/category/add', auth.isInRole('Admin'), controllers.category.getAdd)

  app.get('/post/:id/:title/like', auth.isAuth, controllers.posts.postLike)

  app.get('/post/:id/:title/dislike', auth.isAuth, controllers.posts.dislikePost)
}
