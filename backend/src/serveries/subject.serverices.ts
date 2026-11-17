import express from 'express';
import { createSubject, deleteSubject, getAllSubject, updateSubject } from '../controllers/subject.controllers';
import { authorize, protect } from '../middleware/auth';



const router =express.Router()


// Create class
router.post("/createsubject", protect,authorize(["admin", "teacher"]), createSubject);

// Get All class
router.get("/",protect,authorize(["admin", "teacher"]), getAllSubject);

// Update class
router.patch( "/updateSubject/:id",protect,authorize(["admin", "teacher"]) , updateSubject);

// Delete class
router.delete(  "/deletesubject/:id",protect ,authorize(["admin", "teacher"]), deleteSubject);




export default router