import pool from "../config/database.js";

// Get user wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const [wishlistItems] = await pool.query(
            `SELECT w.id, p.* FROM wishlist w
             LEFT JOIN products p ON w.product_id = p.id
             WHERE w.user_id = ?`,
            [userId]
        );

        // Get images for each product
        for (let item of wishlistItems) {
            const [images] = await pool.query(
                "SELECT url FROM product_images WHERE product_id = ?",
                [item.product_id]
            );
            item.images = images;
        }

        res.status(200).json({
            success: true,
            items: wishlistItems,
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching wishlist",
        });
    }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Please provide product ID",
            });
        }

        // Check if already in wishlist
        const [existing] = await pool.query(
            "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist",
            });
        }

        const [result] = await pool.query(
            "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
            [userId, productId]
        );

        res.status(201).json({
            success: true,
            message: "Added to wishlist",
            wishlistId: result.insertId,
        });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error adding to wishlist",
        });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        await pool.query(
            "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        res.status(200).json({
            success: true,
            message: "Removed from wishlist",
        });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error removing from wishlist",
        });
    }
};

// Get wishlist items for a user (admin)
export const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const [wishlistItems] = await pool.query(
            `SELECT w.id, p.* FROM wishlist w
             LEFT JOIN products p ON w.product_id = p.id
             WHERE w.user_id = ?`,
            [userId]
        );

        res.status(200).json({
            success: true,
            items: wishlistItems,
        });
    } catch (error) {
        console.error("Error fetching user wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user wishlist",
        });
    }
};
