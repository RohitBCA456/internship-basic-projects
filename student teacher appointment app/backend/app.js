import express from "express";
import dotenv from "dotenv";
import studentRouter from "./routers/studentRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";
import teacherRouter from "./routers/teacherRouter.js";
import adminRouter from "./routers/adminRouter.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/student", studentRouter);
app.use("/appointment", appointmentRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);

export { app };
