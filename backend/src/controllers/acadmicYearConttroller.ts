import type { Request, Response } from "express";
import AcademicYear from '../models/acadmicYeatSchema';
import { logActiviy } from "../utils/activitiesLogs";
import type { AuthRequest } from "../middleware/auth";


//export const createA9demicYear = async (req:Request , res:Response) :Promise<void> => {}

    export const createAdemicYear = async (req:AuthRequest , res:Response) :Promise<void> => {
    try {
        const {name , fromYear , toYear , isCurrent} = req.body;
        const existingYear = await AcademicYear.findOne({ fromYear , toYear })
        if (existingYear) {
            res.status(400).json({ status: "error",message: "Acdmic Year already exists"});
            return;
        }
        if (isCurrent) {
            await AcademicYear.updateMany({isCurrent:true},{isCurrent:false})
            
        }

        const academicYear =await AcademicYear.create({
            name,
            fromYear,
            toYear,
            isCurrent:isCurrent || false
        })
        await logActiviy({
        userId: req.user!._id,
        action: "Create Academic Year",
        details: `Created academic year: ${academicYear.name}`
        });
        res.status(201).json(academicYear);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
            
    }
    }

    export const getCurrentAdemicYear = async (req:Request , res:Response) :Promise<void> => {
        try {
            const currentYear =await AcademicYear.findOne({  isCurrent:true })
            if (!currentYear) {
                res.status(404).json({ status: "error",message: "No Current acdemic Yeat Found" });
            }else{
                res.status(200).json(currentYear);
            }
        } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
            
        }
    }

    export const updatecurrentAdemicYear = async (req:AuthRequest , res:Response) :Promise<void> => {
        try {
            
            const {isCurrent} = req.body
            if (isCurrent) {
                await AcademicYear.updateMany({ _id:{$ne :req.params.id} }, { isCurrent: false })
            }

            const updateYear = await AcademicYear.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                returnDocument: "after",
                runValidators: true
                }
            )
            await logActiviy({
            userId: req.user!._id,
            action: "Update Academic Year",
            details: `Updated academic year: ${updateYear?.name}`
            });


            res.status(200).json({
            status: "success",
            message: "Current Academic Year updated successfully",
            academicYear: updateYear,
            });

        } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
            
        }
    }

    export const deleteAdemicYear = async (req:AuthRequest , res:Response) :Promise<void> => {
        try {
            const year=await AcademicYear.findById(req.params.id)
            if (!year) {
                res.status(404).json({ status: "error",message: "No acdemic Yeat Found" });
                return;
            }
            if (year) {
                if (year.isCurrent) {
                    res.status(400).json({ message: "Cannot delete the current acadmic Year" });
                    return;
                }
            }
            await year.deleteOne()

            await logActiviy({
        userId: req.user!._id,
        action: "Delete Academic Year",
        details: `Deleted academic year: ${year.name}`
        });
        res.status(201).json(year)

        } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
            
        }
    }
    
    export const getAllAcademicYears = async (req: Request,res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string

        const query :any ={}
        if (search) {
            query.name ={$regex :search ,$options:"i"}
        }

        const [total , years] = await Promise.all([
            AcademicYear.countDocuments(query),
            AcademicYear.find(query)
            .sort({createdAt:-1})
            .skip((page-1) * limit)
            .limit(limit)
        ])
        
        res.json({
            years,
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
};



