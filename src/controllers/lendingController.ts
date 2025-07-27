import  e,{ Request, Response,NextFunction } from "express";
import { APIError } from "../errors/ApiError";
import{ LendingModel} from "../models/lending";

export const createLending = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating a new lending record...", req.body);
    
    try {
        const lending = new LendingModel(req.body);
        await lending.save();
        res.status(201).json(lending);
    } catch (error: any) {
        next(error);
    }
}

export const getLendings = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Fetching lendings...");
    try {
        const lendings = await LendingModel.find().populate('readerId').populate('bookId');
        res.status(200).json(lendings);
    } catch (error: any) {
        next(error);
    }
}
 export const updateLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedLending = await LendingModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedLending) {
            throw new APIError(404, "Lending not found");
        }
        res.status(200).json(updatedLending);
    } catch (error: any) {
        next(error);
    }
}