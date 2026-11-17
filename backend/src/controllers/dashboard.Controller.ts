

import { type Request, type Response } from "express";

import User from "../models/user.Schema";
import Class from "../models/class.Schema";
import Exam from "../models/exams.model";
import Submission from "../models/submission.model";
import ActivityLog from "../models/activitieslogshema";
import Timetable from "../models/timetable.Schema";

// Get today's day name
const getTodayName = () =>new Date().toLocaleDateString("en-US",
        { weekday: "long",});

// Get Dashboard Statistics
export const getDashboardStats = async ( req: Request, res: Response) => {
    try {
    const user = (req as any).user;
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const today = getTodayName();

    // Get Recent Activities
    const activityQuery =user.role === "admin" ? {} : { userId: user._id };

    const recentActivities = await ActivityLog.find(activityQuery)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "name");

    const formattedActivity = recentActivities.map((log: any) => ({
    userName: log.userId?.name || "Unknown User",
    action: log.action,
    details: log.details,
    time: log.createdAt,
    }));

    // Admin Dashboard
    if (user.role === "admin") {
    const totalStudents = await User.countDocuments({role: "student",});
    const totalTeachers = await User.countDocuments({  role: "teacher",});
    const totalClasses = await Class.countDocuments();
    const activeExams = await Exam.countDocuments({ isActive: true,});
    const totalExams = await Exam.countDocuments();

    return res.status(200).json({
        status: "success",
        role: "admin",
        data: {
        totalStudents,totalTeachers,totalClasses,activeExams,totalExams,
        recentActivity: formattedActivity,
        },
    });
    }

    // Teacher Dashboard
    else if (user.role === "teacher") {
    const myClassesCount = await Class.countDocuments({  classTeacher: user._id,});
    const myExams = await Exam.find({ teacher: user._id,}).select("_id isActive");
    const myExamIds = myExams.map((exam) => exam._id);
    const totalExams = myExams.length;
    const activeExams = myExams.filter( (exam) => exam.isActive).length;
    const totalSubmissions = await Submission.countDocuments({
        exam: { $in: myExamIds },
        });

      // Find today's timetable
    const timetables = await Timetable.find({ "schedule.day": today, "schedule.periods.teacher": user._id,})
        .populate("class", "name")
        .populate("schedule.periods.subject", "name");

    let nextClass = null;

    for (const timetable of timetables as any[]) {
        const daySchedule = timetable.schedule.find((item: any) => item.day === today);

        if (!daySchedule) continue;

        const teacherPeriods = daySchedule.periods
            .filter(
            (period: any) =>
            period.teacher?.toString() === user._id.toString() ||
            period.teacher?._id?.toString() === user._id.toString()
            ).filter(
            (period: any) => period.startTime >= currentTime)
            .sort((a: any, b: any) =>a.startTime.localeCompare(b.startTime));

        if (teacherPeriods.length > 0) {
        const period = teacherPeriods[0];

            nextClass = {
            className: timetable.class?.name,
            subjectName: period.subject?.name,
            startTime: period.startTime,
            endTime: period.endTime,
            };

            break;
        }
        }

        return res.status(200).json({status: "success", role: "teacher",
        data: {
            myClassesCount,
            totalExams,
            activeExams,
            totalSubmissions,
            nextClass,
            recentActivity: formattedActivity,
        },
        });
    }

    // Student Dashboard
    else if (user.role === "student") {
    const studentClass = user.studentClass;
        if (!studentClass) {
        return res.status(200).json({
            status: "success",
            role: "student",
            data: {
            totalExams: 0,
            submittedExams: 0,
            pendingExams: 0,
            upcomingExams: 0,
            recentActivity: formattedActivity,
            },
        });
        }

        const studentExams = await Exam.find({
        class: studentClass,
        isActive: true,
        });

        const examIds = studentExams.map((exam) => exam._id);
        const submissions = await Submission.find({
        student: user._id,
        exam: { $in: examIds },
        }).select("exam score submittedAt");

        const submittedExamIds = submissions.map((submission) => submission.exam.toString());
        const pendingExams = studentExams.filter((exam) =>!submittedExamIds.includes(exam._id.toString()));
        const upcomingExams = studentExams.filter((exam) => new Date(exam.dueDate) >= now && !submittedExamIds.includes(exam._id.toString()));

        return res.status(200).json({
        status: "success",
        role: "student",
        data: {
            totalExams: studentExams.length,
            submittedExams: submissions.length,
            pendingExams: pendingExams.length,
            upcomingExams: upcomingExams.length,
            recentActivity: formattedActivity,
        },
        });
    }

    return res.status(403).json({status: "error",message: "Unauthorized role",});

    } catch (error) {
    console.log(error);
    return res.status(500).json({status: "error",  message: "Server Error", });
    }
};
