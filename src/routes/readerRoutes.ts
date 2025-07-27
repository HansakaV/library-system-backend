import { Router  } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createReader, getReaders, getReaderById, deleteReader, updateReader } from "../controllers/readerController";

 const readerRoutes = Router();
readerRoutes.post("/", createReader);
readerRoutes.get("/", getReaders);
readerRoutes.get("/:id", authenticateToken, getReaderById);
readerRoutes.delete("/:id", authenticateToken, deleteReader);
readerRoutes.put("/:id", authenticateToken, updateReader);

export default readerRoutes;