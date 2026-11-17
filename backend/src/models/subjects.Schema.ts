

import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
    name: string;
    code: string;
    teacher?: mongoose.Types.ObjectId[];
    hoursPerWeek: number;
    isActive: boolean;
}

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Subject name is required"],
            trim: true,
        },

        code: {
            type: String,
            required: [true, "Subject code is required"],
            unique: true,
            trim: true,
            uppercase: true,
        },

        teacher: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        hoursPerWeek: {
            type: Number,
            required: [true, "Hours per week is required"],
            min: [1, "Hours per week must be at least 1"],
            default: 4,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;

