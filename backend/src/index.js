import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("😭 Server connection failed !!! ", error);
  }
};

startServer();
