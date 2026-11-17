

import express from "express";
import { protect, authorize } from "../middleware/auth";
import { createExam, deleteExam, getExamById, getExamResult, getExams, submitExam, toggleExamStatus, triggerExamGeneration } from "../controllers/exams.controllers";

const router = express.Router();

router.post( "/generate", protect, authorize(["teacher", "admin"]),triggerExamGeneration);
router.post( "/createExam", protect, authorize(["teacher", "admin"]), createExam);
router.get("/getexam", protect, getExams);
router.get("/getexam:id", protect, getExamById);
router.post( "/:id/submit",  protect,  authorize(["student", "admin"]), submitExam);
router.patch( "/:id/status", protect, authorize(["teacher", "admin"]), toggleExamStatus);
router.get("/:id/result", protect,authorize(["student", "admin", "teacher"]), getExamResult);





export default router;
router.delete(
    "/:id",
    protect,
    authorize(["teacher", "admin"]),
    deleteExam
);

