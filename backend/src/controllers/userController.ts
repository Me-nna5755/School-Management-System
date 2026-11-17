import type { Request, Response } from "express";
import User from "../models/user.Schema";
import { generateToken } from "../utils/generateToken";
import { logActiviy } from "../utils/activitiesLogs";
import type { AuthRequest } from "../middleware/auth";



export const registerUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // check exists
        const { name, email, password, role, studentClass, teacherSubject, teacherSubjects, matchPassword, isActive } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ status: "error", message: "Something went wrong! exists user" });
            return;
        }
        // create user
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            studentClass,
            teacherSubject: teacherSubjects ?? teacherSubject
        })

        if (newUser) {
            if (req.user) {
                await logActiviy({
                    userId:req.user._id,
                    action:"Register",
                    details:`Register user email :${newUser.email}`
                })
            }
            res.status(201).json({ 
                _id:newUser._id,
                name :newUser.name,
                email :newUser.email,
                role:newUser.role,
                isActive:newUser.isActive,
                studentClass :newUser.studentClass,
                teacherSubject :newUser.teacherSubject,
                message:"User register Successfully"
            });
        } else{
            res.status(400).json({  message: "Invaild user data" });
        }

    } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
        status: "error",
        message: "Something went wrong! from register",
        error: error instanceof Error ? error.message : String(error)
    });
    }
};

export const loginUser = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const matchpass = user
            ? await user.matchPassword(password)
            : false;

        if (user && matchpass) {
            generateToken(user.id.toString(), res);
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({
                status: "error",
                message: "Invaild email & password"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            user.name = req.body.name || user.name;
            user.email=req.body.email || user.email;
            user.isActive= req.body.isActive  ?? user.isActive;
            user.studentClass=req.body.studentClass ?? user.studentClass;
            user.teacherSubject = req.body.teacherSubjects ?? req.body.teacherSubject ?? user.teacherSubject;

            if (req.body.password) {
                user.password = req.body.password
            }
            const updatedUser = await user.save();
            
            if ((req as any).user) {
                await logActiviy({
                    userId : (req as any).user._id ,
                    action : "Update User",
                    details :`update user email :${updatedUser.email}`
                })
                
            }
            res.status(200).json({
        status: "success",
        message: "User updated successfully",
        user: updatedUser
    });
        }
        else{
            res.status(404).json({ status: "error",message: "user not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const  deleteuser = await User.findById(req.params.id)
        if (deleteuser) {
            await deleteuser.deleteOne();
            if ((req as any).user) {
                await logActiviy({
                    userId : (req as any).user._id ,
                    action : "delete User",
                    details :`delete user email :${deleteuser.email}`
                })   
            }
            res.json({ message: " User deleted user" });

        }else {
            res.status(404).json({ message: "User deleted successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
    }
    
}

export const getUserProfile = async (req:AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user) {
            res.json({
                user:{
                    _id:req.user._id,
                    name :req.user.name,
                    email :req.user.email,
                    role :req.user.role
                }
            })
        }else {
            res.status(401).json({ message: "User unFound" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
        
    }
    
}

// export const logoutUser =async (req: Request, res: Response): Promise<void> => {
//     try {
//         res.cookie("jwt" ,"",{
//             httpOnly:true ,
//             expires :new Date(0),
//             sameSite: "strict",
//             secure: process.env.NODE_ENV === "production",
//             path: "/"
//         })
//         res.status(200).json({
//         status: "success",
//         message: "User logged out successfully"
//     });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ status: "error",message: "Something went wrong!" , error});
        
    
//     }
// }

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        res.status(200).json({
            status: "success",
            message: "User logged out successfully"
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

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const role = req.query.role as string
        const search = req.query.search as string
        const skip = (page -1 ) * limit
        const filter:any ={}

            if (role && role !== "all") {
                filter.role = role
            }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const [total,users] = await Promise.all([
            User.countDocuments(filter),
            User.find(filter)
            .select("-password")
            .populate("studentClass", "_id name code")
            .populate("teacherSubject", "_id name code")
            .sort({createdAt :-1})
            .skip(skip)
            .limit(limit)
        ])
        
        res.status(200).json({
            status: "success",
            results: users.length,
            users: users.map((user) => ({
                ...user.toObject(),
                teacherSubjects: user.teacherSubject ?? []
            })),
            pagination :{
                total,
                page,
                pages:Math.ceil(total /limit),
                limit
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error",message: "Something went wrong!" , error});
        
    
    }
}


