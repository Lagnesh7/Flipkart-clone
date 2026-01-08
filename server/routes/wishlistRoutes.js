import express from "express";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
} from "../controllers/wishlistController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// User wishlist routes
router.get("/", authMiddleware, getWishlist);
router.post("/", authMiddleware, addToWishlist);
router.delete("/:productId", authMiddleware, removeFromWishlist);

// Admin route
router.get("/admin/:userId", adminMiddleware, getUserWishlist);

export default router;
