
import express from 'express';
import { createClass, deleteClass, getAllClass, updateClass } from '../controllers/class.controllers';
import { authorize, protect } from '../middleware/auth';

const router =express.Router()



// Create class
router.post( "/creeteclass",protect, createClass);

// Get All class
router.get("/",protect,authorize(["admin", "teacher"]), getAllClass);

// Update class
router.patch( "/updateclass/:id",protect,authorize(["admin"]), updateClass);

// Delete class
router.delete(  "/delete/:id",protect ,authorize(["admin", "teacher"]), deleteClass);




export default router