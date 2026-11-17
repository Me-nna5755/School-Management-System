
//console.log("Hello via Bun!");
import "../dns-config";
import express, {  type Application,    type NextFunction,   type Request,  type Response, } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database";
import userRoutes from "./serveries/user.serveries";
import logsRouter from "./serveries/activityLogServerice"
import acdemicRouter from "./serveries/acadmicYear.serveries"
import classRouter from "./serveries/class.serveries"
import subjectRouter from "./serveries/subject.serverices";
import timetableRouter from "./serveries/timetable.service";
import examRouter from "./serveries/exam.serverice";
import dashboardRouter from "./serveries/dashboard.serverice";
import { serve } from "inngest/express";
import { inngest } from "./inngest";
import { generateExam, generateTimeTable } from "./inngest/function";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 5000;
    


    
    app.use(express.json());
    app.use(helmet());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
    cors({
    origin: process.env.CLIENT_URL?.split(",").map((url) => url.trim()),
    credentials: true,
})
);

    app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [generateTimeTable ,generateExam],
    }));

    if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    }

    app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        message: "School Management System API is healthy",
    });
    });

    app.use("/api/user", userRoutes);
    app.use("/api/activities" , logsRouter);
    app.use("/api/academic-years", acdemicRouter);
    app.use("/api/class", classRouter);
    app.use("/api/subject", subjectRouter);
    app.use("/api/timeTable" , timetableRouter)
    app.use("/api/exams", examRouter);
    app.use("/api/dashboard", dashboardRouter);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: "error",
        message: "Something went wrong!",
    });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}).catch((error) => {
    console.error("Database connection failed:", error);
});
