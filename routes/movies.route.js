import { Router } from "express";


import { movieController } from "../controllers/movies.controller.js";

export const moviesRouter = Router();

moviesRouter.get("/", movieController.getAll);

moviesRouter.get("/:id", movieController.getByID);

moviesRouter.post("/", movieController.newMovie );

moviesRouter.delete("/:id", movieController.deleteMovie);

moviesRouter.patch("/:id", movieController.updateMovie );
