import express from "express" 

export const app = express()










// router : 
// Mount all routes at /api/v1
import { router } from "./routes/index.js";
app.use('/api/v1', router);