import  e,{ Request, Response,NextFunction } from "express";
import { APIError } from "../errors/ApiError";
import { BookModel } from "../models/book";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating book with data:", req.body);
    try {
         const bookData = {
            ...req.body,
            status: req.body.status ? 'available' : 'unavailable'
        };
        const book = new BookModel(bookData);
        const result = await book.save();
        console.log("Book created successfully:", result);
        res.status(201).json(result);
    } catch (error: any) {
        next(error);
    }
}

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookModel.find();
        res.status(200).json(books);
    } catch (error: any) {
        next(error);
    }
}

export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findById(req.params.id);
        if (!book) {
            throw new APIError(404, "Book not found");
        }
        res.status(200).json(book);
    } catch (error: any) {
        next(error);
    }
}

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedBook = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedBook) {
            throw new APIError(404, "Book not found");
        }
        res.status(200).json(updatedBook);
    } catch (error: any) {
        next(error);
    }
}

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedBook = await BookModel.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            throw new APIError(404, "Book not found");
        }
        res.status(200).json({ message: "Book deleted" });
    } catch (error: any) {
        next(error);
    }
}
