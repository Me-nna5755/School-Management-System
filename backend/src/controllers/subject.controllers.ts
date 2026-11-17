import type { Request, Response } from "express";
import Subject from '../models/subjects.Schema';
import { logActiviy } from "../utils/activitiesLogs";


export const createSubject = async (req:Request , res:Response) :Promise<void> => {
    try {
        const { name, code ,teacher , isActive} = req.body;
        const existingSubject = await Subject.findOne({ code })
        if (existingSubject) {
            res.status(400).json({ status: "error",message: "Acdmic class already exists"});
            return;
        }
                const newSubject =await Subject.create({
                    name,
                    code,
                    teacher : Array.isArray(teacher)?teacher :[],
                    isActive
                    
                })
                const userId =(req as any).user._id
                    await logActiviy({
                    userId: userId,
                    action: "Create Subject",
                    details: `Created academic year: ${newSubject.name}`
                    });
                    res.status(201).json(newSubject)
                
                
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
            
    }
}

export const getAllSubject = async (req: Request,res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string

        const query :any ={}
        if (search) {
            query .$or =[
                {name :{$regex :search ,$options:"i"}},
                { code:{$regex :search ,$options:"i"}}

            ]
        }

        const [total , subjects] = await Promise.all([
            Subject.countDocuments(query),
            Subject.find(query)
            .sort({createdAt:-1})
            .skip((page-1) * limit)
            .limit(limit)
        ])
        
        res.json({
            subjects,
            pagination :{
                total,
                page,
                pages:Math.ceil(total /limit),
                limit
            }
        })
        //res.status(200).json({ status: "success",results: academicYears.length, academicYears});

    } catch (error) {
        console.log(error);
        res.status(500).json({status: "error",message: "Something went wrong!",error});
    }
}

export const updateSubject = async (req: Request, res: Response): Promise<void> => {
    try {
        const SubjectId = req.params.id;
        const { name, code ,teacher ,hoursPerWeek, isActive } = req.body;
        const updatesubject = await Subject.findByIdAndUpdate(
            SubjectId,
            {  name,
                code ,
                teacher , 
                hoursPerWeek,
                isActive  },
            { new: true, runValidators: true }
        );
        if (!updatesubject) {
            res.status(404).json({status: "error",message: " not found", });
            return;
        }
        await logActiviy({
            userId:(req as any).user._id,
            action: "Update Subject",
            details: `Updated Subject: ${updatesubject.name}`,
        });
        res.status(200).json({ status: "success",message: " updated successfully" ,   academicYear: updatesubject });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Something went wrong!", error });
    }
}

export const deleteSubject = async (req:Request , res:Response) :Promise<void> => {
        try {
            const deletesubject=await Subject.findByIdAndDelete(req.params.id)
            const userId=(req as any).user._id;
            if (!deletesubject) {
                res.status(404).json({ status: "error",message: "No acdemic Yeat Found" });
                return;
            } 
            await logActiviy({
            userId: userId,
            action: "Delete Subject",
            details: `Deleted Subject: ${deletesubject.name}`
        });
        res.status(200).json({
            status: "success",
            message: "Subject deleted successfully",
            data: deletesubject
        });

        } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error: error instanceof Error ? error.message : String(error) });
            
        }
}

