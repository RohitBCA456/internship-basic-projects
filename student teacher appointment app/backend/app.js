import express from "express";
import dotenv from "dotenv";
import studentRouter from "./routers/studentRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";
import teacherRouter from "./routers/teacherRouter.js";
import adminRouter from "./routers/adminRouter.js";
import authRouter from "./routers/authRouter.js"
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/student", studentRouter);
app.use("/appointment", appointmentRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

export { app };
