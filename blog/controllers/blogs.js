const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
// const jwt = require('jsonwebtoken')


// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {

  const user = await User.findById(request.user.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({ ...request.body, user: user._id })

  try {
    const savedblog = await blog.save()
    user.blogs = user.blogs.concat(savedblog._id)
    await user.save()
    response.status(201).send(savedblog)
  }
  catch (e) {
    next(e)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try{
    const updatedPerson = await Blog.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
    res.json(updatedPerson)
  }
  catch (e) {
    next(e)
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {

  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete a blog' })
  }
  try{
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  catch (e) {
    next(e)
  }
})

module.exports = blogsRouter