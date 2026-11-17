
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const databaseURL = process.env.MONGO_URL;

        if (!databaseURL) {
            throw new Error("MONGO_URL is missing from .env");
        }

        await mongoose.connect(databaseURL);

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};