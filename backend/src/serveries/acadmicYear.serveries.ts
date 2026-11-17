import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { createAdemicYear, deleteAdemicYear, getAllAcademicYears, getCurrentAdemicYear, updatecurrentAdemicYear } from '../controllers/acadmicYearConttroller';

const router =express.Router()



// Create Academic Year
router.post( "/createAcdemicYear", protect, authorize(["admin", "teacher"]), createAdemicYear);

// Get Current Academic Year
router.get("/getCurrentAdemicYear", protect,authorize(["admin", "teacher"]),getCurrentAdemicYear);

// Get All Academic Years
router.get("/",protect,authorize(["admin", "teacher"]), getAllAcademicYears);

// Update Academic Year
router.patch( "/current/:id",protect, authorize(["admin", "teacher"]), updatecurrentAdemicYear);

// Delete Academic Year
router.delete(  "/delete/:id",   protect, authorize(["admin", "teacher"]),deleteAdemicYear);




export default router