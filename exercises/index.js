const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, req, res , next) => {
  console.error(error.message)
  if (error.name === 'CastError'){
    return res.status(404).send({ error: 'malformed ID' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })

})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person){
      res.json(person)
    }
    else{
      res.status(404).send({ error: 'Malformed ID' })
    }
  })
    .catch(e => {
      next(e)
    })
})

app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body
  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true }).then(updatedPerson => {
    res.json(updatedPerson)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(() =>
  {
    res.status(204).end()
  }
  )
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(e => next(e))
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const date = new Date(Date.now())
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date.toString()}</p>`)
  })

})
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})