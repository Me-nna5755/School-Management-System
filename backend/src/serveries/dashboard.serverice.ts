
import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { getDashboardStats } from '../controllers/dashboard.Controller';

const router =express.Router()



router.get(
  "/getDashboard",
  protect,
  authorize(["admin", "teacher", "student"]),
  getDashboardStats
);



export default router