import { validateSchema, validatePartial } from "../schema/schema.js";
import { movieModel } from "../models/movies.models.js";



export class movieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await movieModel.getAll({ genre });

    res.json(movies);
  }

  static async getByID(req, res){
    const { id } = req.params;
  
    const movie = await movieModel.getById({ id });
  
    if (movie) return res.json(movie);
    res.status(404).json({ Message: "movie not found" });
  }

  static async newMovie(req, res){
    const result = validateSchema(req.body);
  
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
  
    const newMovie = await movieModel.create({ input: result.data });
  
    res.status(201).json(newMovie);
  }

  static async deleteMovie (req, res){
    const { id } = req.params;
  
    const result = await movieModel.delete({ id });
  
    if (result == false) {
      res.status(404).json({ message: "Movie not found" });
    }
  
    return res.json({ message: "Movie deleted" });
  }

  static async updateMovie (req, res){
    const result = validatePartial(req.body);
  
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
  
    const { id } = req.params;
  
    const updateMovie = await movieModel.update({ id, input: result.data });
  
    return res.json(updateMovie);
  }


}
