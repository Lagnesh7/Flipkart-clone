import express from "express";
import {
    register,
    login,
    checkUserAuth,
    checkAdminAuth,
    forgotPassword,
    resetPassword,
    updateDetails,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/user-auth", authMiddleware, checkUserAuth);
router.get("/admin-auth", authMiddleware, checkAdminAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/update-details", updateDetails);

export default router;
