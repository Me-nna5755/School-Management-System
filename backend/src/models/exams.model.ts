import mongoose, { Schema, type Document, Types } from "mongoose";


export interface IQuestion {
    _id:mongoose.Types.ObjectId;
    questionText: string;
    type: "MCQ" | "SHORT_ANSWER";
    options?: string[];
    correctAnswer: string;
    points: number;
}

export interface IExam extends Document {
    title: string;
    description?: string;
    subject: mongoose.Types.ObjectId;
    class: mongoose.Types.ObjectId;
    teacher: mongoose.Types.ObjectId;
    duration:number;
    questions:IQuestion[];
    dueDate:Date;
    isActive:boolean
}

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true,
        trim: true,
    },

    type: {
        type: String,
        enum: ["MCQ","SHORT_ANSWER" ],
        required: true,
    },

    options: {
        type: [String],
        default: [],
    },

    correctAnswer: {
        type: String,
        required: true,
    },

    points: {
        type: Number,
        required: true,
        min: 1,
    },
});

const examSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        duration: {
            type: Number,
            required: true,
            min: 1,
        },

        questions: {
            type: [questionSchema],
            required: true,
            default: [],
        },

        dueDate: {
            type: Date,
            required: true,
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




const Exam = mongoose.model<IExam>("Exam", examSchema);

export default Exam;
