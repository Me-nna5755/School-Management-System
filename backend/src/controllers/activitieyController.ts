import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import ActivitiesLog from "../models/activitieslogshema";

export const getAllActivities = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const count = await ActivitiesLog.countDocuments();

        const logs = await ActivitiesLog.find()
            .populate("userId", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: "success",
            logs,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        console.error("Get Activities Error:", error);

        res.status(500).json({
            status: "error",
            message: "Server Error"
        });
    }
};

export const createActivity = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { action, details } = req.body;

        if (typeof action !== "string" || !action.trim()) {
            res.status(400).json({
                status: "error",
                message: "Action is required"
            });
            return;
        }

        if (!req.user) {
            res.status(401).json({
                status: "error",
                message: "Not authorized, no user"
            });
            return;
        }

        const activity = await ActivitiesLog.create({
            userId: req.user._id,
            action: action.trim(),
            details: typeof details === "string" ? details.trim() : undefined
        });

        const populatedActivity = await activity.populate(
            "userId",
            "name email role"
        );

        res.status(201).json({
            status: "success",
            message: "Activity created successfully",
            log: populatedActivity
        });
    } catch (error) {
        console.error("Create Activity Error:", error);

        res.status(500).json({
            status: "error",
            message: "Server Error"
        });
    }
};