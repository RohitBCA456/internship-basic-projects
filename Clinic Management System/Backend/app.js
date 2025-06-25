import cookieParser from "cookie-parser";
import express from "express";
import { logger } from "./middleware/logger.js";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/authRouter.js";
import patientRouter from "./routers/patientRouter.js";
import prescriptionRouter from "./routers/prescriptionRouter.js";
import billRouter from "./routers/billRouter.js"

dotenv.config({path: "./.env"})

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/user", userRouter);
app.use("/patient", patientRouter);
app.use("/prescription", prescriptionRouter);
app.use("/bill", billRouter);

export { app };
