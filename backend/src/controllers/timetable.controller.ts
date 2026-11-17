import type { Request, Response } from "express";
import { logActiviy } from "../utils/activitiesLogs";
import { inngest } from "../inngest";
import Timetable from "../models/timetable.Schema";


export const generateTimetable = async (req:Request, res:Response) =>{
    try {
        const {classId , academicYearId , settings } = req.body;
        const userId = (req as any).user._id;
        await inngest.send({
            name : "timetable/generate" ,
            data:{
                classId , academicYearId , settings
            }
        })
        await logActiviy({
            userId,
            action: `Generated timetable for class: ${classId}`,
            details: `Academic Year: ${academicYearId}`
        });
        return res.status(202).json({  status: "success",  message: "Timetable generated request sent  successfully" });
    } catch (error) {
        
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
    
    }
}

export const getTimetable = async (req: Request, res: Response) => {
    try {
    
    const timetable = await Timetable.findOne(
        { class:req.params.classId })
        .populate("schedule.periods.subject" , "name code")
        .populate("schedule.periods.teacher" , "name email");

    if (!timetable) {
        return res.status(404).json({  status: "error",  message: "Timetable not found", });
    }

    return res.status(200).json({ status: "success",  message: "Timetable fetched successfully",  data: timetable });
    } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error",message: "Something went wrong!" , error});
    
    }
};




