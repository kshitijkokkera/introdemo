const express = require('express')
const app = express()

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.use(express.json())

app.post('/api/notes', (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({ 
        error: 'content missing' 
        })
    }
    const maxID = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }


    notes = notes.concat(note)
    res.json(note)


})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find((note) => note.id === id)
    if (note){
        res.json(note)
    }
    else{
        res.status(404).end()
    }
    
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter((note) => note.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})