

import mongoose, { Schema, type Document } from "mongoose";
import bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = "admin",
    TEACHER = "teacher",
    STUDENT = "student",
    PARENT="parent"
}
export type userRoles = "admin" |"teacher" | "student" |"parent";

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role: userRoles;
    phone?: string;
    isActive: boolean;
    studentClass?:string| null;
    teacherSubject?: mongoose.Types.ObjectId[] ;
    matchPassword(candidataPassword:string):Promise<boolean>
}

const userSchema :Schema<IUser> =new Schema({
    name:{type:String ,required:true},
    email:{type:String ,required:true ,unique: true,lowercase: true,trim: true},
    password: {type: String,  required: true,  minlength: 8 },
    role: { type: String,enum: Object.values(UserRole), default: UserRole.STUDENT},
    phone: { type: String },
    isActive: {type: Boolean,  default: true },
    studentClass: {  type:mongoose.Schema.Types.ObjectId ,ref:'Class'  },
    teacherSubject: [{ type: mongoose.Schema.Types.ObjectId, ref:'Subject' ,default: null}]
}, {
    timestamps: true
})

userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    console.log("Password hashed successfully");
});

userSchema.methods.matchPassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User =mongoose.model<IUser>("User" , userSchema)

export default User ;