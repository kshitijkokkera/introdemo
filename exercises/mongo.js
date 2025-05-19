const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.05puemr.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {type: String,
        minLength: 3,
        required: true
        },
  number: {type: String,
        minLength: 1,
        required: true
        },
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length === 3){
    console.log("phonebook:")
    Person.find({}).then(result => {
  result.forEach(note => {
    console.log(note.name, note.number)
  })
  mongoose.connection.close()
})
}
else{
const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
  mongoose.connection.close()
})
}
