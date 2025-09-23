import { asynHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const registerUser = asynHandler(async (req, res) => {
    const { username, email, password } = req.body;  // <-- req.body, NOT req.user

    console.log("email:", email , "username" , username);


    res.status(201).json({ message: "User registered successfully" });
});

