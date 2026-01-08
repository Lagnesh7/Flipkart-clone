import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUserProfile,
    deactivateAccount,
    getUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    getUserOrders,
    getUserWishlist,
    getWishlistProducts,
    updateWishlist,
    createCheckoutSession,
    paymentSuccess,
} from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// User orders routes (place before :userId routes to avoid conflicts)
router.get("/orders", authMiddleware, getUserOrders);

// User wishlist routes
router.get("/wishlist", authMiddleware, getUserWishlist);
router.get("/wishlist-products", authMiddleware, getWishlistProducts);
router.put("/wishlist", authMiddleware, updateWishlist);
router.post("/update-wishlist", authMiddleware, updateWishlist);

// Payment routes
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.post("/payment-success", authMiddleware, paymentSuccess);

// User routes
router.get("/", adminMiddleware, getAllUsers);
router.get("/:userId", authMiddleware, getUserById);
router.put("/:userId", authMiddleware, updateUserProfile);
router.put("/:userId/deactivate", authMiddleware, deactivateAccount);

// Address routes
router.get("/:userId/addresses", authMiddleware, getUserAddresses);
router.post("/:userId/addresses", authMiddleware, addUserAddress);
router.put("/:userId/addresses/:addressId", authMiddleware, updateUserAddress);
router.delete(
    "/:userId/addresses/:addressId",
    authMiddleware,
    deleteUserAddress
);

export default router;
