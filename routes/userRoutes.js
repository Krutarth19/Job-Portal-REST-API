import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { updateUser } from '../controllers/userController.js';

// router object
const router = express.Router();

// routes

// -> Update user
router.put('/update-user', userAuth, updateUser);

export default router;