import { Request, Response, NextFunction } from "express"
import { UserModel } from "../models/user"
import { APIError } from "../errors/ApiError"
import bcrypt from "bcrypt"
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken"

// Constants for token expiration
const ACCESS_TOKEN_EXPIRATION = "30s"
const REFRESH_TOKEN_EXPIRATION = "7d"

// Helper to create Access Token
const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: ACCESS_TOKEN_EXPIRATION })
}

// Helper to create Refresh Token
const createRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_EXPIRATION })
}

// SIGNUP - Create User
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return next(new APIError(409, "Email already in use"))
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = new UserModel({ name, email, password: hashedPassword })
    await user.save()

    const userResponse = { _id: user._id, name: user.name, email: user.email }
    res.status(201).json(userResponse)
  } catch (err) {
    next(err)
  }
}

// LOGIN - Send JWT tokens
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
      return next(new APIError(401, "Invalid email or password"))
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return next(new APIError(401, "Invalid email or password"))
    }

    // Create tokens
    const accessToken = createAccessToken(user._id.toString())
    const refreshToken = createRefreshToken(user._id.toString())
    console.log("Access Token:", accessToken)
    console.log("Refresh Token:", refreshToken)

    // Set refresh token in HttpOnly cookie
    const isProduction = process.env.NODE_ENV === "production"
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction, // Secure only in production
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      path: "/api/auth/refresh-token", // restrict cookie to refresh token route
    })

    // Send access token in response
    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    console.log("login error", err)
    next(err)
  }
}

// REFRESH TOKEN - issue new access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      return next(new APIError(401, "Refresh token missing"))
    }

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: Error | null, decoded: string | JwtPayload | undefined) => {
        if (err) {
          if (err instanceof TokenExpiredError) {
            return next(new APIError(401, "Refresh token expired"))
          } else if (err instanceof JsonWebTokenError) {
            return next(new APIError(401, "Invalid refresh token"))
          } else {
            return next(new APIError(401, "Could not verify refresh token"))
          }
        }

        if (!decoded || typeof decoded === "string") {
          return next(new APIError(401, "Invalid refresh token payload"))
        }

        const userId = decoded.userId as string
        const user = await UserModel.findById(userId)

        if (!user) {
          return next(new APIError(401, "User not found"))
        }

        const newAccessToken = createAccessToken(userId)
        res.status(200).json({ accessToken: newAccessToken })
      }
    )
  } catch (err) {
    next(err)
  }
}

// LOGOUT - Clear refresh token cookie
export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProduction = process.env.NODE_ENV === "production"

    // Clear the refresh token cookie by setting it to empty and expired
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      expires: new Date(0), // Set cookie expiration to past date
      path: "/api/auth/refresh-token", // Same path as when set
    })

    res.status(200).json({ message: "Logged out successfully" })
  } catch (err) {
    next(err)
  }
}

// GET ALL USERS (unchanged)
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find().select("-password")
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
}