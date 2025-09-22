import jwt from "jsonwebtoken"; 
// 🔹 Importing `jsonwebtoken` package to verify and decode JWT tokens.

import { ApiError } from "../utils/ApiError.js"; 
// 🔹 Custom error class (production-level error handling).

import { User } from "../models/user.model.js"; 
// 🔹 Importing the User model so we can fetch user details from DB.

import { asyncHandler } from "../utils/asyncHandler.js"; 
// 🔹 Wrapper function to handle async/await errors (avoids try-catch in every controller/middleware).


// Middleware to verify access token
export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // 1️⃣ Get token from cookies OR Authorization header
  const token =
    req.cookies?.accessToken ||                // 🔹 If token exists in cookies, pick it
    req.headers?.authorization?.replace("Bearer ", ""); 
    // 🔹 If token is in `Authorization: Bearer <token>`, extract it by removing "Bearer ".

  if (!token) {
    throw new ApiError(401, "Access token is missing or expired");
    // 🔹 If token is missing in both cookies and headers, throw Unauthorized error.
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // 🔹 Verify token using the secret key from `.env`.
    // 🔹 If invalid/expired, jwt will throw an error.
    // 🔹 If valid, it returns the payload we signed (id, email, username).

    // 3️⃣ Find the user in DB using decoded.id
    const user = await User.findById(decoded.id).select("-password");
    // 🔹 Fetch user from DB with the ID inside token payload.
    // 🔹 `.select("-password")` makes sure password field is not returned.

    if (!user) {
      throw new ApiError(401, "User not found with this token");
      // 🔹 If user is not found, it means token is invalid (maybe user deleted).
    }

    // 4️⃣ Attach user to request for next middlewares/controllers
    req.user = user;
    // 🔹 Now `req.user` will be available everywhere (e.g., controllers).
    
    next(); 
    // 🔹 Call the next middleware/controller → request continues.

  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
    // 🔹 If jwt.verify fails (expired/invalid signature), throw error.
  }
});