const { request, response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
const morgan = require('morgan')
app.use(express.static('build'))

app.use(cors())
let persons = [
    {
        id: 1,
        name: "Ale",
        number: "20195689"

    },
    {
        id: 2,
        name: "Pao",
        number: "201936652"

    },
    {
        id: 3,
        name: "Lau",
        number: "20193336"
    }
]

/*const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}*/

app.use(express.json())//este tambien es un middleware, nos permite manipulas objetos con contenido json
//app.use(requestLogger)

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :total-time[digits] :body'))
const totalPersons = () => {
    return persons.length
}
const findPerson = (id) => persons.find(e => e.id === id)

app.get('/', (request, response) => {
    response.send('<h1>Lista de Personas</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response) => {
    const pers = totalPersons();
    // const date = new Date();
    response.send(`<h1>La lista de personas tiene  información de ${pers} personas en total.</h1>
                    <h2> ${new Date()} </h2>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //console.log(id)
    const person = findPerson(id)
    //2 maneras distintas de responder lo mismo
    person ? response.json(person) : response.send('Error id no existente')
    // if (person) response.json(person)
    // else response.send('Error id no existente')
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(e => e.id !== id)
    response.status(204).end()
})
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}
const findName = (name) => persons.find(e => e.name === name)
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name && !body.number) { //con esto le indico que esos campos son requeridos sino tire un error
        return response.status(400).json({
            error: 'Error , todos los campos son requeridos'
        })
    }
    if (findName(body.name)) response.send("El nombre ya existe, escoja otro")

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})