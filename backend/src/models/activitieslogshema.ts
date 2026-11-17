import mongoose from "mongoose";
import type { Document, Schema } from "mongoose";

export interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId;
    action: string;
    details?: string;
}

const activitiesLogSchema: Schema<IActivityLog> = new mongoose.Schema<IActivityLog>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        action: {
            type: String,
            required: true
        },
        details: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const ActivitiesLog = mongoose.model<IActivityLog>(
    "ActivitiesLog",
    activitiesLogSchema
);

export default ActivitiesLog;
