import ActivitiesLog from "../models/activitieslogshema";
import mongoose from "mongoose";

interface ICreateActivityLog {
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: string;
}

export const logActiviy = async ({
    userId,
    action,
    details
}: ICreateActivityLog): Promise<void> => {
    try {
        await ActivitiesLog.create({
            userId,
            action,
            details
        });
    } catch (error) {
        console.log("Activity Log Error:", error);
    }
};
