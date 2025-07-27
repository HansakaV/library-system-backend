import { Router } from "express";
import { createLending,getLendings,updateLending } from "../controllers/lendingController";

const lendingRoutes = Router();

lendingRoutes.post("/", createLending);
lendingRoutes.get("/", getLendings);
lendingRoutes.put("/:id", updateLending);


export default lendingRoutes;