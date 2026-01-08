import express from "express";
import {
    getUserOrders,
    getOrderById,
    createCheckoutSession,
    verifyPayment,
    getAllOrders,
    updateOrderStatus,
    deleteAllOrders,
} from "../controllers/orderController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// User order routes
router.get("/", authMiddleware, getUserOrders);
router.get("/:orderId", authMiddleware, getOrderById);

// Stripe checkout
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.post("/verify-payment", authMiddleware, verifyPayment);

// Admin order routes
router.get("/admin/all", adminMiddleware, getAllOrders);
router.put("/admin/:orderId", adminMiddleware, updateOrderStatus);
router.delete("/admin/delete-all", adminMiddleware, deleteAllOrders);

export default router;
