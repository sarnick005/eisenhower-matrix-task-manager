import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.Routes.js";
import taskRouter from "./routes/task.Routes.js";


app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

export { app };
