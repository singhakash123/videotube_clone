import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import morgan from "morgan"
import { limit } from "./constant.js"

// App configuration
export const app = express();


// --------------------- MIDDLEWARE SETUP ---------------------
// 1. Security Middlewares : 
  app.use(helmet())
  app.use(cors({
       credentials : true , 
       origin : process.env.CORS_ORIGIN 
  }))


app.use(cookieParser())


// 2. Body Parsing : 
app.use(express.json({
     limit
}))  // from the form 

app.use(express.urlencoded({
  extended : true , 
  limit
}))  // from the url 


// 3. Static File Serving : 
app.use(express.static('public'))  // for the pdf or other : 

// 4 . rate limiting : 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// loging : 
app.use(morgan("dev"))

// router : 
// Routes : 
import { router } from "./routes/index.js"
// prefix for API
app.use("/api/v1", router);

/*
🏆 Final API Endpoints
POST    /api/v1/user/register → register user
GET /api/v1/video/ → get all videos
*/



/*


how to setup routes from here : 
import { router } from "./routes/index.js";


 --------------------- ROUTES ---------------------
app.use("/api/v1", router);




🔥 Final Clean Endpoints:

POST /api/v1/user/register
POST /api/v1/user/login
GET /api/v1/book
POST /api/v1/book/add

               ✅ Final Clean Endpoints
POST http://localhost:8000/api/v1/user/register
POST http://localhost:8000/api/v1/user/login
POST http://localhost:8000/api/v1/book/add
GET http://localhost:8000/api/v1/book

*/