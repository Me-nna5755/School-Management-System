
import  express from "express";
import { deleteUser, getAllUser, getUserProfile, loginUser, logoutUser, registerUser, updateUser } from "../controllers/userController";
import { authorize, protect } from "../middleware/auth";

const router =express.Router()

router.post("/register" , registerUser)
router.post("/login"  ,loginUser)
router.post("/logout" ,logoutUser)
router.get("/profile" ,protect, getUserProfile)
router.get("/getAllUsers" ,protect,authorize(["admin" , "teacher"]) , getAllUser)
router.patch("/update/:id" ,protect ,authorize(["admin" , "teacher"]) , updateUser)
router.delete("/delete/:id" ,protect ,authorize(["admin" , "teacher"]) , deleteUser)




export default router