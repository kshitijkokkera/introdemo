require('dotenv').config()

const BLOG_PORT = process.env.BLOG_PORT
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_BLOG_MONGODB_URI : process.env.BLOG_MONGODB_URI
// const MONGODB_URI = process.env.TEST_BLOG_MONGODB_URI
module.exports = { MONGODB_URI, BLOG_PORT }