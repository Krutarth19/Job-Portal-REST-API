import express from "express";
import userAuth from '../middlewares/authMiddleware.js'
import { createJobsController, getAllJobsController, updateJobController, deleteJobController, jobStatsController } from "../controllers/jobsController.js";
const router = express.Router();

// Create Job || POST
router.post("/create-job", userAuth, createJobsController);

// get jobs || get
router.get("/get-job", userAuth, getAllJobsController);

// Update jobs || patch
router.patch("/update-job/:id", userAuth, updateJobController);

// Delete jobs || patch
router.delete("/delete-job/:id", userAuth, deleteJobController);

// get jobs || get
router.get("/job-stats", userAuth, jobStatsController);

export default router;