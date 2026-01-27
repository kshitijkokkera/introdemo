const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const api = supertest(app)
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const initialUser = {
  username: 'root',
  name: 'Root User',
  passwordHash: '$2b$10$6EjmS148LIm/wgeGXaylLODe5F77N0Z6QYd9xtBNJ0rhf2VudvRSm',
  blogs: [],
  __v: 0
}

var token = null
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const userForToken = new User(initialUser)
  await userForToken.save()
  token = jwt.sign({ username: userForToken.username, id: userForToken._id }, process.env.SECRET)
  initialBlogs.map(blog => blog.user = userForToken._id)
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json and correct amount', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have id property', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(Object.hasOwn(response.body[0], 'id'), true)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Metaphysics',
    author: 'aristotle',
    url: 'link to book.com',
    likes: 312
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  assert(contents.includes(newBlog.title))
})

test('a blog can be made without likes ', async () => {
  const newBlog = {
    title: 'Metaphysics',
    author: 'aristotle',
    url: 'link to book.com',
    user: (await User.findOne({ username: initialUser.username }))._id
  }

  const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)
  assert.strictEqual(response.body.likes, 0)
})

test('a blog has to have url or title', async () => {
  const newBlog = {
    title: 'Metaphysics',
    author: 'aristotle',
  }

  const response = await api.post('/api/blogs').send(newBlog)
  assert(response.status, 400)
})

test('a blog can be deleted', async () => {
  const newBlog = {
    title: 'Metaphysics',
    author: 'aristotle',
    url: 'link to book.com',
    user: (await User.findOne({ username: initialUser.username })).id
  }

  const savedBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)

  await api.delete(`/api/blogs/${savedBlog.body.id}`).set('Authorization', `Bearer ${token}`).expect(204)
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a blog can be updated', async () => {
  const newBlog = {
    title: 'Metaphysics',
    author: 'aristotle',
    url: 'link to book.com',
    likes: 3
  }

  const modifiedBlog = { ...newBlog, title: 'On the soul' }
  const savedBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)
  const response = await api.put(`/api/blogs/${savedBlog.body.id}`).set('Authorization', `Bearer ${token}`).send(modifiedBlog)
  assert.deepStrictEqual(response.body, { ...modifiedBlog, id: savedBlog.body.id, user: savedBlog.body.user  })
})

test('adding a blog fails with 401 if token not provided', async () => {
  const newBlog = {
    title: 'Metaphysics',
    author: 'aristotle',
    url: 'link to book.com',
    likes: 3
  }

  const response = await api.post('/api/blogs').send(newBlog)
  assert.strictEqual(response.status, 401)
})

test('deleting a blog fails with 401 if token not provided', async () => {
  const newBlog = {
    title: 'Metaphysics',
    author: 'aristotle',
    url: 'link to book.com',
    likes: 3
  }

  const savedBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)

  await api.delete(`/api/blogs/${savedBlog.body.id}`).expect(401)
})

after(async () => {
  await mongoose.connection.close()
})