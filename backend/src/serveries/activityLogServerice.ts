import express, { type Request, type Response } from 'express';
import { getAllActivities, createActivity } from '../controllers/activitieyController';
import { authorize, protect } from '../middleware/auth';


const router = express.Router()

router.get("/" ,  protect, authorize(["admin","teacher"]),  getAllActivities)
router.post("/", protect, authorize(["admin"]), createActivity)



export default router
