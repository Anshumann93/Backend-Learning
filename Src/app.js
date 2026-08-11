import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"

dotenv.config({ path: "./.env" });

const app=express();

app.use(cors({origin: process.env.CORS_ORIGIN,
    credentials: true}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import routes
import userRouter from "./routes/user.router.js";

app.use("/api/v1/users", userRouter);

export default app