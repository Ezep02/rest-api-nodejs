import express, { json } from "express";
import { moviesRouter } from "./routes/movies.route.js";
import { corsMiddleware } from "./middlewares/cors.js";


const App = express();
App.use(json());

App.use(corsMiddleware());
App.disable("x-powered-by");

App.use("/movies", moviesRouter);

const PORT = process.env.PORT ?? 5000;
App.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
});
