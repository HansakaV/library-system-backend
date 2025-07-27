import { Router } from "express"
import readerRoutes from "./readerRoutes"
import bookRoutes from "./bookRoutes"
import lendingRoutes from "./lendingRoutes" 
import authRoutes from "./authRoutes"
import notificationRoutes from "./notificationRoutes"

const rootRouter = Router()
rootRouter.use("/readers", readerRoutes)
rootRouter.use("/books", bookRoutes)
rootRouter.use("/lendings", lendingRoutes)
rootRouter.use("/notifications", notificationRoutes)
rootRouter.use("/auth", authRoutes)

export default rootRouter
