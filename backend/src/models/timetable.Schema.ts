

import mongoose, { Schema, Document } from "mongoose";


export interface IPeriod {
    subject: mongoose.Types.ObjectId | null ;
    teacher: mongoose.Types.ObjectId| null ;
    startTime: string;
    endTime: string;
}

export interface IDaySchedule {
    day: string;
    periods: IPeriod[];
}

export interface ITimetable extends Document {
    class: mongoose.Types.ObjectId;
    academicYear: mongoose.Types.ObjectId;
    schedule: IDaySchedule[];
    createdAt: Date;
}

const timetableSchema = new Schema(
    {
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        academicYear: {
            type: Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },

        schedule: [
            {
                day: {
                    type: String,
                    required: true,
                },

                periods: [
                    {
                        subject: {
                            type: Schema.Types.ObjectId,
                            ref: "Subject",
                            default: null,
                        },

                        teacher: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                            default: null,
                        },

                        startTime: {
                            type: String,
                            required: true,
                        },

                        endTime: {
                            type: String,
                            required: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);


timetableSchema.index(
    { class: 1, academicYear: 1 },
    { unique: true }
);


const Timetable = mongoose.model<ITimetable>( "Timetable", timetableSchema );
export default Timetable;
