
import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { generateTimetable, getTimetable } from '../controllers/timetable.controller';

const router =express.Router()



// Create Admin only
router.post( "/generatetimetable", protect, authorize(["admin"]), generateTimetable);

router.get( "/:classId",protect, getTimetable);



export default router