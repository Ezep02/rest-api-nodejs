const express = require("express");
const movies = require("./movies.json");
const crypto = require("node:crypto");
const validateMovie = require("./schema/schema");

const App = express();
App.use(express.json());
App.disable("x-powered-by");

const ACCEPTED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:1234",
  "http://movies.com",
];

App.get("/movies", (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-origin", origin);
  }

  const { genre } = req.query;
  if (genre) {
    const findeGenere = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() == genre.toLocaleLowerCase())
    );
    return res.json(findeGenere);
  }

  res.json(movies);
});

//retorna la pelicula por id
App.get("/movies/:id", (req, res) => {
  const { id } = req.params;

  const movie = movies.find((movie) => movie.id == id);
  if (movie) return res.json(movie);
  res.status(404).json({ Message: "movie not found" });
});

App.post("/movies", (req, res) => {
  const result = validateMovie.validateSchmea(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

App.delete("/movies/:id", (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-origin", origin);
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id == id);

  if (movieIndex == -1) {
    res.status(404).json({ message: "Movie not found" });
  }

  movies.slice(movieIndex, 1);
  return res.json({ message: "Movie deleted" });
});

App.options("/movies/:id", (req, res) => {
  const origin = req.header("origin");

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    res.send(200)
    }
  
});

App.patch("/movies/:id", (req, res) => {
  const result = validateMovie.validatePartial(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id == id);

  if (movieIndex == -1) {
    return res.status(404).json({ message: "movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

const PORT = process.env.PORT ?? 5000;
App.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
});
