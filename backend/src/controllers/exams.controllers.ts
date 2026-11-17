

import type { Request, Response } from "express";
import Subject from "../models/subjects.Schema";
import Exam from "../models/exams.model";
import { logActiviy } from "../utils/activitiesLogs";
import { inngest } from "../inngest";
import User from '../models/user.Schema';
import type { IDaySchedule } from '../models/timetable.Schema';
import submissionModel from "../models/submission.model";



export const triggerExamGeneration = async ( req: Request,  res: Response) => {
    try {
        const {  title,   subject,   class: classId,   duration,  dueDate, topic,  difficulty,  count, } = req.body;
        const subjectDoc = await Subject.findById(subject);
        if (!subjectDoc) {
            return res.status(404).json({  status: "error",   message: "Subject not found", });
        }

        const teacherId = (req as any).user._id;
        const draftExam = await Exam.create({
            title: title || `Auto-Generated: ${topic}`,
            subject,
            class: classId,
            teacher: teacherId,
            duration: duration || 60,
            dueDate:
                dueDate ||
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isActive: false,
        });

        await logActiviy({
            userId: teacherId,
            action: "User triggered exam generation",
            details: `Exam ID: ${draftExam._id}`,
        });

        await inngest.send({
            name: "exam/generate",
            data: {
                examId: draftExam._id.toString(),
                topic,
                subjectName: subjectDoc.name,
                difficulty: difficulty || "Medium",
                count: count || 10,
            },
        });

        return res.status(202).json({
            status: "success",
            message: "Exam generation request sent successfully",
            data: {
                examId: draftExam._id,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({  status: "error",  message: "Server Error", error });
    }
};

export const createExam = async (req: Request, res: Response) => {
    try {
        
        const exam = await Exam.create({
            ...req.body ,
            teacher:(req as any ).user._id});

            const userId = (req as any ).user._id
            await logActiviy({
                userId,
                action: "user created a new exam",
            });

        return res.status(201).json({status: "success",  message: "Exam created successfully", data: exam,});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Server Error",  error, });
    }
};

export const getExams = async (req: Request, res: Response) => {
    try {
        const user =(req as any).user
        let query ={}

            if (user.role === "student") {
                query ={class:user.studentClass, isActive:true}
            }else{
                query ={teacher:user._id}
            }

        const exams = await Exam.find()
            .populate("subject" , "name")
            .populate("class" , "name class")
            .select("-questions.correctAnswer" );
        return res.status(200).json({ status: "success",  message: "Exams fetched successfully",   data: exams,  });
    } catch (error) {
        console.log(error);
        return res.status(500).json({  status: "error",  message: "Server Error",   error   });
    }
};

export const toggleExamStatus = async (req: Request, res: Response) => {
    try {
        const examId = req.params.id;
        const user = (req as any).user;
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({  message: "Exam not found"  });
        }

        if (
            user.role !== "admin" &&
            exam.teacher.toString() !== user._id.toString()
        ) {
            return res.status(403).json({  message: "Not authorized to modify this exam"  });
        }

        // Toggle the status
        exam.isActive = !exam.isActive;
        await exam.save();
                const userId = (req as any).user._id;
                await logActiviy({
                        userId,
                        action: "User toggled exam status",
                });

        res.json({
            message: `Exam is now ${exam.isActive ? "Active" : "Inactive"}`,
            _id: exam._id,
            isActive: exam.isActive,
        });

    } catch (error: any) {
        res.status(500).json({  message: error.message  });
    }
};

export const submitExam = async (req: Request, res: Response) => {
    try {
        const { answers } = req.body;
        const studentId = (req as any).user._id;
        const examIdParam = req.params.id;
        const examId = Array.isArray(examIdParam) ? examIdParam[0] : examIdParam;

        if (!examId) {
            return res.status(400).json({ message: "Exam ID is required"  });
        }

        const existingSubmission = await submissionModel.findOne({
            exam: examId,
            student: studentId,
        });

        if (existingSubmission) {
            return res.status(400).json({ message: "You have already submitted this exam."  });
        }
        const exam = await Exam.findById(examId).select("+questions.correctAnswer");

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        let score = 0;
        let totalPoints = 0;

        exam.questions.forEach((question) => {
            totalPoints += question.points;

            const studentAns = answers.find( (a: any) => a.questionId === question._id.toString() );
            if ( studentAns &&  studentAns.answer === question.correctAnswer ) {
                score += question.points;
            }
        });

        
        await submissionModel.create({
            exam: examId,
            student: studentId,
            answers,
            score,
        });

        const userId = (req as any).user._id;
        await logActiviy({
            userId,
            action: "User submitted an exam",
        });

        res.status(201).json({ message: "Exam submitted successfully",  score, total: totalPoints, });

    } catch (error: any) {  
        res.status(500).json({   message: error.message });
    }
};

export const getExamResult = async (req: Request, res: Response) => {
    try {
        const studentId = (req as any).user._id;
        const examId = req.params.id;
        const submission = await submissionModel.findOne({
            exam: examId,
            student: studentId, 
        }).populate({
            path: "exam",
            select: "title questions._id questions.correctAnswer",
        });
        if (!submission) {
            return res.status(404).json({ message: "No submission found"  });
        }
        res.json(submission);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getExamById = async (req: Request, res: Response) => {
    try {
        const { answers } = req.body;
        const user = (req as any).user;
        const studentId = user._id;
        const examIdParam = req.params.id;
        const examId = Array.isArray(examIdParam) ? examIdParam[0] : examIdParam;

        if (!examId) {
            return res.status(400).json({ message: "Exam ID is required" });
        }
        if (!Array.isArray(answers)) {
            return res.status(400).json({  message: "Answers must be an array" });
        }
        const existingSubmission = await submissionModel.findOne({ exam: examId, student: studentId });
        if (existingSubmission) {
            return res.status(400).json({ message: "You have already submitted this exam." });
        }
        const exam = await Exam.findById(examId).select("+questions.correctAnswer");
        if (!exam) {
            return res.status(404).json({ message: "Exam not found"});
        }
        if (!exam.isActive) {
            return res.status(403).json({message: "This exam is not active"});
        }
        if (!user.studentClass || exam.class.toString() !== user.studentClass.toString() ) {
            return res.status(403).json({ message: "You are not authorized to submit this exam" });
        }

        let score = 0;
        let totalPoints = 0;

        exam.questions.forEach((question) => {
            totalPoints += question.points;
            const studentAns = answers.find( (a: any) => a.questionId === question._id.toString());
            if (studentAns && studentAns.answer === question.correctAnswer ) {
                score += question.points;
            }
        });

        await submissionModel.create({ exam: examId, student: studentId, answers,score});
        const userId = user._id;
        await logActiviy({ userId, action: "User submitted an exam"});

        return res.status(201).json({ message: "Exam submitted successfully", score, total: totalPoints});
    } catch (error: any) {
        console.log(error);
        if (error?.name === "CastError") {
            return res.status(400).json({  message: "Invalid exam id" });
        }
        return res.status(500).json({status: "error",message: "Server Error",  error });
    }
};












export const deleteExam = async (req: Request, res: Response) => {
    try {
        const examId = req.params.id;
        const user = (req as any).user;
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        if (user.role !== "admin" && exam.teacher.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this exam" });
        }
        await Exam.findByIdAndDelete(examId);
        await logActiviy({ userId: user._id, action: "User deleted an exam" });
        return res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
