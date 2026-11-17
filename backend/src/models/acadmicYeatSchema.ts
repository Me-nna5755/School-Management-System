import mongoose, { Schema, type Document } from "mongoose";

export interface IAcadmicYear extends Document {
    name: string;
    fromYear: Date;
    toYear: Date;
    isCurrent: boolean;
}

const academicYearSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Academic year name is required"],
            trim: true,
        },

        fromYear: {
            type: Date,
            required: [true, "Start year is required"],
        },

        toYear: {
            type: Date,
            required: [true, "End year is required"],
        },

        isCurrent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const AcademicYear = mongoose.model<IAcadmicYear>(
    "AcademicYear",
    academicYearSchema
);

export default AcademicYear;