import express, { Request, Response } from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/mongo"
import rootRouter from "./routes"
import { errorHandler } from "./middlewares/errorHandler"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()

// Handle CORS - Fixed version
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://library-management-neon-chi.vercel.app'
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"], // Fixed: was "allowedHeader"
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT

app.use("/api", rootRouter)
app.use(errorHandler)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})