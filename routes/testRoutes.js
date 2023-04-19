import express from "express";
import { textPostController } from "../controllers/testController.js";
import userAuth from "../middlewares/authMiddleware.js";
// Router Obj
const router = express.Router();

router.post("/test-post", userAuth, textPostController);


export default router;