import { Router } from "express";
import { userRouter } from "./user.routes.js";

export const router = Router();

// Mount userRouter on /user
router.use('/user', userRouter);
