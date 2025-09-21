import dotenv from "dotenv"
import { db_connected } from "./db/index.js";
import { app } from "./app.js";
// ------------------- ENV CONFIG -------------------

dotenv.config({
     path : "./.env"
})

// ---------------------------- PORT CONFIG ------------

const port = process.env.PORT || 4000


// start server 

const startServer = async () => {
  try {
    await db_connected();
    console.log("✅ Database connected successfully");

    const server = app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });

    server.on("error", (error) => {
      console.error("❌ Server-level error:", error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
