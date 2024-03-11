require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
// app.use(requestLogger)
//app.use(morgan('tiny'))
morgan.token('data', function (req, res) { 
  return (req.method == 'POST' ? JSON.stringify(req.body) : '') 
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
const generateId = () => {
  const Id = Math.floor(Math.random() * 10000);
  return Id
}

app.get('/api/persons',(request,response) => {
  Person.find({}).then(p => {
    response.json(p)
  })
  // response.contentType('application/json').json(persons)
})

app.get('/api/persons/:id', (request,response,next) => {
  const id = request.params.id
  Person.findById(id)
  .then(p=> {
    if (p) {
      response.json(p)
    } else {
      response.statusMessage=`Person with id ${id} not found`
      response.status(404).end()
    }
  })
  .catch(e=>{
    next(e)
  })
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
  .then(updatedNote => {
    response.json(updatedNote)
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request,response,next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number
  })   
  person.save().then(result => {
    console.log('person saved!')
    response.json(result)
  }).catch(e=>next(e))
})
app.delete('/api/persons/:id', (request,response,next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result=>{
      console.log(result)
      response.status(204).end()
    })
    .catch(e=>next(e))
})

app.get('/info',(request,response) => {
  Person.countDocuments({})
    .then(result=>{
      let info = `<p>Phonebook has info for ${result} people` + '<br/>' + new Date() + '</p>'
      response.send(info) 
    })
  
 
  // console.log(persons)
  // let personCount = persons.length 
  // let info = `<p>Phonebook has info for ${personCount} people` + '<br/>' + new Date() + '</p>' 
  // response.send(info)
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)