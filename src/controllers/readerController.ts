import { ReaderModel } from "../models/readers";
import e, { Request, Response, NextFunction } from "express";
import { APIError } from "../errors/ApiError";


export const createReader = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating reader with data:", req.body);
    try {
        const reader = new ReaderModel(req.body);
        await reader.save();
        res.status(201).json(reader);
    } catch (error: any) {
        next(error);
    }
}

export const getReaders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const readers = await ReaderModel.find();
        res.status(200).json(readers);
    } catch (error: any) {
        next(error);
    }
}

export const getReaderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.id);
        if (!reader) {
            throw new APIError(404, "Reader not found");
        }
        res.status(200).json(reader);
    } catch (error: any) {
        next(error);
    }
}

export const deleteReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedReader = await ReaderModel.findByIdAndDelete(req.params.id);
        if (!deletedReader) {
            throw new APIError(404, "Reader not found");
        }
        res.status(200).json({ message: "Reader deleted" });
    } catch (error: any) {
        next(error);
    }
} 

export const updateReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedReader = await ReaderModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if (!updatedReader) {
            throw new APIError(404, "Reader not found");
        }
        res.status(200).json(updatedReader);
    } catch (error: any) {
        next(error);
    }
}
