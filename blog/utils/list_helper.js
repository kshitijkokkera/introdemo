var _ = require('lodash')

const dummy = () => {
  return 1
}
const total_likes = blogs => {
  if (blogs.length === 0){
    return 0
  }
  const sum = blogs.reduce((acc, curr) => acc + curr.likes, 0)
  return sum
}

const favoriteBlog = blogs => {
  if (blogs.length === 0){
    return {}
  }
  return blogs.reduce((max, curr) => max.likes > curr.likes ? max : curr)
}

const mostBlogs = blogs => {
  if (blogs.length === 0){ return {}}
  let counts =  _.countBy(blogs, 'author')
  // eslint-disable-next-line no-unused-vars
  return _.maxBy(_.map(blogs, (v, i, c ) => ({ author: v.author, nblogs: counts[v.author] })), (i) => i.nblogs)
}

const mostLikes = blogs => {
  if (blogs.length === 0){ return {}}

  let g = _.groupBy(blogs, 'author')
  // eslint-disable-next-line no-unused-vars
  return _.maxBy(_.map(g, (v, i, c) => ({ author: i, likes: _.sumBy(v, 'likes') })), 'likes')
}

module.exports = { dummy, total_likes, favoriteBlog, mostBlogs, mostLikes }