import { asynHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

export const registerUser = asynHandler (async (req , res ) => {
            const {username , email , password} = req.user
})
