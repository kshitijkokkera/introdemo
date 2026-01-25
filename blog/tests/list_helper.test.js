const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list', () => {
    const blogs = []

    const result = listHelper.total_likes(blogs)
    assert.strictEqual(result, 0)
  })
  test('list of one blog', () => {
    const blogs = [{
      title: 'another example blog',
      author: 'my twin',
      url: 'some url.com thats also different',
      likes: 200
    }]

    const result = listHelper.total_likes(blogs)
    assert.strictEqual(result, 200)
  })
  test('list of many', () => {
    const blogs = [{
      title: 'another example blog',
      author: 'my twin',
      url: 'some url.com thats also different',
      likes: 200
    },
    {
      title: 'another example blog',
      author: 'my twin',
      url: 'some url.com thats also different',
      likes: 200
    },
    {
      title: 'another example blog',
      author: 'my twin',
      url: 'some url.com thats also different',
      likes: 200
    }]

    const result = listHelper.total_likes(blogs)
    assert.strictEqual(result, 600)
  })
})

test('favorite blog', () => {
  const blogs = [{
    title: 'first example blog',
    author: 'my twin',
    url: 'some url.com thats also different',
    likes: 500
  },
  {
    title: 'second example blog',
    author: 'my twin',
    url: 'some url.com thats also different',
    likes: 300
  },
  {
    title: 'third example blog',
    author: 'my twin',
    url: 'some url.com thats also different',
    likes: 100
  }]

  const result = listHelper.favoriteBlog(blogs)
  assert.deepStrictEqual(result,
    {
      title: 'first example blog',
      author: 'my twin',
      url: 'some url.com thats also different',
      likes: 500
    })
})
