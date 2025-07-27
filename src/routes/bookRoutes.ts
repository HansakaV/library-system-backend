import { Router } from "express"
import {
  createBook,
  getBooks,
  getBookById,
  deleteBook,
  updateBook,
} from "../controllers/booksController" 

const bookRoutes = Router()

bookRoutes.post("/", createBook) 
bookRoutes.get("/", getBooks)
bookRoutes.get("/:id", getBookById)
bookRoutes.delete("/:id", deleteBook)
bookRoutes.put("/:id", updateBook)

export default bookRoutes
