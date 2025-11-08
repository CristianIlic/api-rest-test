const express = require('express')
const app = express()
const PORT = process.env.PORT ?? 1234
const movies = require('./movies.json')

app.disable("x-powered-by")

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => { //path-to-regexp
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  
  res.status(404).json({ message: 'Movie not found' })
})

app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`)
})