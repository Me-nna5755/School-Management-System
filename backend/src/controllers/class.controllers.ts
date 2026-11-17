import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import Class from "../models/class.Schema";
import User from "../models/user.Schema";

declare const console: {
    log(...data: unknown[]): void;
};

const logActiviy = async ({
    user,
    action,
    details,
}: {
    user: string;
    action: string;
    details: string;
}): Promise<void> => {
    console.log("Activity Log:", { user, action, details });
};

//export const createA9demicYear = async (req:Request , res:Response) :Promise<void> => {}

export const createClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            academicYear,
            classTeacher,
            capacity
        } = req.body;

        const existingClass = await Class.findOne({ name, academicYear });

        if (existingClass) {
            res.status(400).json({
                status: "error",
                message: "Academic class already exists"
            });
            return;
        }

        const newClass = await Class.create({
            name,
            academicYear,
            classTeacher,
            capacity
        });

        // Send response immediately after successful creation
        res.status(201).json({
            status: "success",
            message: "Class created successfully",
            data: newClass
        });

        // Activity logging must not block class creation
        try {
            const userId = (req as any).user?._id ?? (req as any).user?.id;

            if (userId) {
                await logActiviy({
                    user: userId,
                    action: "Create Class",
                    details: `Created class: ${newClass.name}`
                });
            }
        } catch (logError) {
            console.log("Class Activity Log Error:", logError);
        }

    } catch (error) {
        console.log("Create Class Error:", error);

        if (!res.headersSent) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong!"
            });
        }
    }
};
export const updateClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const classId = req.params.id;
        const { name, academicYear, classTeacher, capacity ,subjects} = req.body;
        const existingClass = await Class.findOne({name, academicYear, _id: { $ne: classId }, });
        if (existingClass) {
            res.status(400).json({ status: "error",  message: "Academic class already exists", });
            return;
        }
        const updateClass = await Class.findByIdAndUpdate(
            classId,
            { name, academicYear, classTeacher, capacity,subjects },
            { new: true, runValidators: true }
        );
        if (!updateClass) {
            res.status(404).json({status: "error",message: "Class not found", });
            return;
        }
        await logActiviy({
            user: (req as any).user?._id ?? (req as any).user?.id,
            action: "Update Class",
            details: `Updated Class: ${updateClass.name}`,
        });
        res.status(200).json({ status: "success",message: "Class updated successfully" ,   academicYear: updateClass });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Something went wrong!", error });
    }
}

export const deleteClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleteclass = await Class.findByIdAndDelete(req.params.id);

        if (!deleteclass) {
            res.status(404).json({
                status: "error",
                message: "Class not found"
            });
            return;
        }

        const userId = (req as any).user._id;

        await logActiviy({
            user: userId,
            action: "Delete Class",
            details: `Deleted class: ${deleteclass.name}`
        });

        res.status(200).json({
            status: "success",
            message: "Class deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
export const getAllClass = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string;

        const query: any = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const [total, classes] = await Promise.all([
            Class.countDocuments(query),
            Class.find(query)
                .populate("classTeacher", "name email")
                .populate("academicYear", "name")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        const classesWithStudentCount = await Promise.all(
            classes.map(async (classItem: any) => {
                const studentQuery: any = {
                    studentClass: classItem._id,
                    role: "student"
                };

                return {
                    ...classItem.toObject(),
                    studentsCount: await User.countDocuments(studentQuery)
                };
            })
        );

        res.status(200).json({
            status: "success",
            classes: classesWithStudentCount,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
            error
        });
    }
};

