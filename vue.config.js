function mock (app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: process.env.NODE_ENV  === 'production'
   ? './'
    : '/',
  devServer: {
    before (app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/detail', listData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/home', listData)
      mock(app, '/book/flat-list', flatListData)
    }
  }
}
