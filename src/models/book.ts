import mongoose from "mongoose";

type Book = {
  isbn: string
  title: string
  author: string
  status: 'available' | 'unavailable'
}

const bookSchema = new mongoose.Schema<Book>({
  isbn: {
    type: String,
    required: [true, "ISBN is required"],
    unique: [true, "ISBN already exists"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Book title is required"],
    minlength: [1, "Title must be at least 1 character long"],
    maxlength: [200, "Title cannot exceed 200 characters"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    minlength: [2, "Author name must be at least 2 characters long"],
    maxlength: [100, "Author name cannot exceed 100 characters"],
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'unavailable'],
      message: "Status must be available or unavailable"
    },
    default: 'available',
  },
})

export const BookModel = mongoose.model("Book", bookSchema)
