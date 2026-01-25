const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
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
  const blog = new Blog(request.body)
  try {
    const savedblog = await blog.save()
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
  try{
    Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  catch (e) {
    next(e)
  }
})

module.exports = blogsRouter