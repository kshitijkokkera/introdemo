import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
    const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

    const addBlog = event => {
        event.preventDefault()
        createBlog(newBlog)
        setNewBlog({ title: '', author: '', url: '' })
    }

    return (
        <div>
            <form onSubmit={addBlog}>
            <div>
                <label>
                title
                <input
                    type="text"
                    value={newBlog.title}
                    onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
                />
                </label>
            </div>
            <div>
                <label>
                author
                <input
                    type="text"
                    value={newBlog.author}
                    onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
                />
                </label>
            </div>
            <div>
                <label>
                url
                <input
                    type="text"
                    value={newBlog.url}
                    onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
                />
                </label>
            </div>
            <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm