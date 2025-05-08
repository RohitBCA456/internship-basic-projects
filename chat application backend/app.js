import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./router/user.router.js";

dotenv.config({ path: ".env" });
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/user", userRouter)

export { app };
