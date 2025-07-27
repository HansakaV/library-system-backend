import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { APIError } from "../errors/ApiError"

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    console.log("token", token)

    // 401 -> unauthorized
    // 403 -> forbidden

    if (!token) {
      throw new APIError(403, "Access token not found")
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          throw new APIError(403, "Access token expired")
        } else if (err instanceof JsonWebTokenError) {
          throw new APIError(403, "Invalid access token")
        } else {
          throw new APIError(500, "Access token error")
        }
      }

      if (!decoded || typeof decoded === "string") {
        throw new APIError(500, "Access token payload error")
      }
      next()
    })
  } catch (error) {
    next(error)
  }
}
