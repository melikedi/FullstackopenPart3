const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://melikedi:${password}@cluster0.vbmfyk6.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
},{ collection: 'persons' })

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3 ) {
  Person.find({}).then(result => {
    let phonebook = 'phonebook:'
    result.forEach(p => {
      phonebook = phonebook + '\n' + p.name + ' ' + p.number
    })
    console.log(phonebook)
    mongoose.connection.close()
  })
}
else {
  const personName = process.argv[3]
  const personNumber= process.argv[4]
  if (personName && personNumber) {
    const person = new Person({
      name: personName,
      number: personNumber
    })
    person.save().then(result => {
      console.log('person saved!', result)
      mongoose.connection.close()
    })
  } else {
    console.log('Name or Number missing')
    process.exit(1)
  }
}


