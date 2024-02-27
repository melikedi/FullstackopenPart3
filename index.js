const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
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
  response.contentType('application/json').json(persons)
})
app.get('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  const note = persons.find(person=> person.id===id)
  if (note) {
      response.json(note)
  } else {
      
      response.statusMessage=`Note with id ${id} not found`
      response.status(404).end()
      console.log(response)
  }
})

app.post('/api/persons', (request,response) => {
  const body = request.body
  if(!body.name){
      return response.status(400).json({error:'name missing'})
  } else {
    if (persons.filter(p=>p.name == body.name).length>0) {
      return response.status(400).json({error:'name already exists in the phonebook'})
    }
  }
  if(!body.number){
    return response.status(400).json({error:'number missing'})
  }
  const person = {
      name: body.name,
      number: body.number,
      id:generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})
app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(n=>n.id !== id)
  response.status(204).end()
})

app.get('/info',(request,response) => {
  console.log(persons)
  let personCount = persons.length 
  let info = `<p>Phonebook has info for ${personCount} people` + '<br/>' + new Date() + '</p>' 
  response.send(info)
})

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)