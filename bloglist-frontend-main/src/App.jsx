import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, isError: false })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = blogObject => {
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNotification({ message: `Blog '${returnedBlog.title}' by '${returnedBlog.author}' added successfully`, isError: false })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    })
    .catch(error => {
      setNotification({ message: `Error: ${error.response.data.error}`, isError: true })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    })
  }

  const likeBlog = id => {
    const blog = blogs.find(b => b.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    blogService.update(id, updatedBlog).then(returnedBlog => {
      setBlogs(blogs.map(b => (b.id === id ? returnedBlog : b)))
    }).catch(error => {
      setNotification({ message: `Error: ${error.response.data.error}`, isError: true })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      // Handle login error
      console.log('wrong credentials')
      setNotification({ message: 'Invalid username or password', isError: true })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} isError={notification.isError} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} isError={notification.isError} />
      {user.name} logged in
      <Togglable buttonLabel="create new blog">
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} />
      )}
    </div>
  )
}

export default App