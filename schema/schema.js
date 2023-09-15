import z from "zod";

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Movie tilte must be string",
    required_error: "Movie tilte is required",
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: "Poster must be a valir URL",
  }),
  genre: z.array(
    z.enum([
      "Action",
      "Drama",
      "Adventure",
      "Comedy",
      "Fantasy",
      "Horror",
      "Thriller",
      "Sci-Fi",
    ]),
    {
      required_error: "Movie genere must be required",
      invalid_type_error: "Movie genere must be an array of enum genere",
    }
  ),
});

export function validateSchema(object){
    return movieSchema.safeParse(object)
}

export function validatePartial(input){
  return movieSchema.partial().safeParse(input)
}

