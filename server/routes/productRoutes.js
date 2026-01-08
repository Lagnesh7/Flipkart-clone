import express from "express";
import {
    getAllProducts,
    getFilteredProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductReviews,
    addProductReview,
} from "../controllers/productController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Product routes - NOTE: specific routes must come BEFORE parameterized routes
router.get("/", getAllProducts);
router.get("/filtered-products", getFilteredProducts);
router.get("/:productId", getProductById);
router.post("/new-product", adminMiddleware, createProduct);
router.put("/:productId", adminMiddleware, updateProduct);
router.delete("/:productId", adminMiddleware, deleteProduct);

// Review routes
router.get("/:productId/reviews", getProductReviews);
router.post("/:productId/reviews", authMiddleware, addProductReview);

export default router;
