const express = require('express')
const cors = require('cors')
const crypto = require('node:crypto')
const app = express()
const {validatePokemon, validatePartialPokemon} = require('./schema/test1schema.js')

app.disable('x-powered-by')
app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
  const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'http://127.0.0.1:5500'
]
if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    return callback(null, true)
  }

return callback(new Error('Not allowed by CORS'))
}
}))



// metodos normales: GET/HEAD/POST
// metodos "complejos": PUT/PATCH/DELETE requieren cors pre-flight

// CORS PRE-Flight hara una petición llamada OPTIONS que está sin cors


const pokemon = [
  {
    id: '1',
    name: 'tulicharmander',
    skill: 'tulifire',
    type: ['fire'],
    size: 'XS'
  },
  {
    id: '2',
    name: 'tulisquirtle',
    skill: 'tuliwater',
    type: ['water'],
    size: 'M'
  },
  {
    id: '3',
    name: 'tulivulvaSour',
    type: ['leaf'],
    skill: 'tulipapilla',
    size: 'XS'
  }
]

app.get('/pokemon', (req, res) => {
  res.json(pokemon)
})

app.get('/pokemon/:id', (req, res) => {
  const { id } = req.params
  const pokemonIndex = pokemon.find(pokemon => pokemon.id === id)

  res.json(pokemonIndex)
})

app.delete('/pokemon/:id', (req, res) => {
  const { id } = req.params
  const pokemonIndex = pokemon.findIndex(pokemon => pokemon.id === id)

  if (pokemonIndex > 0) {
    return res.status(404).json({ message: 'Pokemon not found' })
  }

  pokemon.splice(pokemonIndex, 1)

  return res.json({ message: 'Pokemon deleted' })
})

app.post('/pokemon', (req, res) => {

  const result = validatePokemon(req.body)

  if (result.error) {
    return res.status(400).json({error: JSON.parse(result.error.message)} )
  }

  const newPokemon = {
    id: crypto.randomUUID,
    ...result.data
  }
  

  pokemon.push(newPokemon)
  res.status(201).json(newPokemon)
})

app.patch('/pokemon/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialPokemon(req.body)

  if (result.error) {
    return res.status(400).json({error: JSON.parse(result.error.message)})
  }


  const pokemonIndex = pokemon.findIndex(pokemon => pokemon.id === id)
  
  if (pokemonIndex < 0) {
    return res.status(404).json({message: 'Pokemon not found'})
  }

  const updatedPokemon = {
    ...pokemon[pokemonIndex],
    ...result.data
  }

  pokemon[pokemonIndex] = updatedPokemon
  return res.json(updatedPokemon)
})

app.get('/', async (req, res ) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon
      `)

    if (!response.ok) {
      return res.status(404).json({message: 'No se pudo cargar la lista de pokemon'})
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error
    res.status(500).json({message: 'No se pudo establecer conexión a la API'})
  }
})

app.get('/pokemon/:name', async (req, res) => {
  const { name } = req.params
  try {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  
  if (!response.ok) {
    return res.status(404).send({ message: 'Pokemon not found' })
  }

  const data = await response.json()
  if (data) return res.json(data)
  } catch (error) {
    console.error
    res.status(500).json({message: 'No se pudo establecer conexión a la API'})

  }

  })

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`)
})