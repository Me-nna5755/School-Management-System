

import mongoose, { Schema, type Document } from "mongoose";

export interface IClass extends Document {
    name: string;
    academicYear:mongoose.Types.ObjectId;
    classTeacher: mongoose.Types.ObjectId | null;
    subjects : mongoose.Types.ObjectId[];
    students: mongoose.Types.ObjectId[];
    capacity: number;
    
}

const classSchema = new Schema<IClass>(
    {
        name: {
            type: String,
            required: [true, "Class name is required"],
            trim: true,
        },

        academicYear: {
            type: Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: [true, "Academic year is required"],
        },

        classTeacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default:null
        },

        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],

        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        capacity: {
            type: Number,
            default: 40,
            min: [1, "Capacity must be at least 1"],
        },
    },
    {
        timestamps: true,
    }
);

const Class = mongoose.model<IClass>("Class", classSchema);
export default Class;

