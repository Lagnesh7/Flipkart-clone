import pool from "../config/database.js";

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT p.*, b.name as brand_name, c.name as category_name
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN categories c ON p.category_id = c.id
            LIMIT 100
        `);

        // Get images for each product
        for (let product of products) {
            const [images] = await pool.query(
                "SELECT url FROM product_images WHERE product_id = ?",
                [product.id]
            );
            product.images = images;
        }

        res.status(200).json({
            success: true,
            total: products.length,
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching products",
        });
    }
};

// Get filtered products
export const getFilteredProducts = async (req, res) => {
    try {
        const { category, priceRange, ratings } = req.query;

        let query = `
            SELECT p.*, b.name as brand_name, c.name as category_name
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;

        let params = [];

        if (category) {
            query += ` AND c.name = ?`;
            params.push(category);
        }

        if (priceRange) {
            const [minPrice, maxPrice] = JSON.parse(priceRange);
            query += ` AND p.discountPrice BETWEEN ? AND ?`;
            params.push(minPrice, maxPrice);
        }

        if (ratings) {
            query += ` AND p.rating >= ?`;
            params.push(parseInt(ratings));
        }

        const [products] = await pool.query(query, params);

        // Get images for each product
        for (let product of products) {
            const [images] = await pool.query(
                "SELECT url FROM product_images WHERE product_id = ?",
                [product.id]
            );
            product.images = images;
        }

        res.status(200).json({
            success: true,
            total: products.length,
            products,
        });
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching filtered products",
        });
    }
};

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const [products] = await pool.query(`
            SELECT p.*, b.name as brand_name, c.name as category_name
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [productId]);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const product = products[0];

        // Get images
        const [images] = await pool.query(
            "SELECT url FROM product_images WHERE product_id = ?",
            [productId]
        );
        product.images = images;

        // Get reviews
        const [reviews] = await pool.query(
            "SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ?",
            [productId]
        );
        product.reviews = reviews;

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching product",
        });
    }
};

// Create product (admin only)
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            stock,
            category,
            brand,
            seller,
            images,
        } = req.body;

        if (!name || !price || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Get brand ID
        const [brandResult] = await pool.query(
            "SELECT id FROM brands WHERE name = ?",
            [brand]
        );

        let brandId;
        if (brandResult.length === 0) {
            const [newBrand] = await pool.query(
                "INSERT INTO brands (name) VALUES (?)",
                [brand]
            );
            brandId = newBrand.insertId;
        } else {
            brandId = brandResult[0].id;
        }

        // Get category ID
        const [categoryResult] = await pool.query(
            "SELECT id FROM categories WHERE name = ?",
            [category]
        );

        let categoryId;
        if (categoryResult.length === 0) {
            const [newCategory] = await pool.query(
                "INSERT INTO categories (name) VALUES (?)",
                [category]
            );
            categoryId = newCategory.insertId;
        } else {
            categoryId = categoryResult[0].id;
        }

        // Create product
        const [result] = await pool.query(
            "INSERT INTO products (name, description, price, discountPrice, stock, category_id, brand_id, seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                name,
                description || null,
                price,
                discountPrice || price,
                stock || 0,
                categoryId,
                brandId,
                seller || "Flipkart",
            ]
        );

        const productId = result.insertId;

        // Add images
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                await pool.query(
                    "INSERT INTO product_images (product_id, url, isMain) VALUES (?, ?, ?)",
                    [productId, images[i], i === 0]
                );
            }
        }

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            productId,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Error creating product",
        });
    }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const {
            name,
            description,
            price,
            discountPrice,
            stock,
            category,
            brand,
            seller,
        } = req.body;

        // Get brand ID
        const [brandResult] = await pool.query(
            "SELECT id FROM brands WHERE name = ?",
            [brand]
        );

        let brandId = brandResult[0]?.id;
        if (!brandId) {
            const [newBrand] = await pool.query(
                "INSERT INTO brands (name) VALUES (?)",
                [brand]
            );
            brandId = newBrand.insertId;
        }

        // Get category ID
        const [categoryResult] = await pool.query(
            "SELECT id FROM categories WHERE name = ?",
            [category]
        );

        let categoryId = categoryResult[0]?.id;
        if (!categoryId) {
            const [newCategory] = await pool.query(
                "INSERT INTO categories (name) VALUES (?)",
                [category]
            );
            categoryId = newCategory.insertId;
        }

        await pool.query(
            "UPDATE products SET name = ?, description = ?, price = ?, discountPrice = ?, stock = ?, category_id = ?, brand_id = ?, seller = ? WHERE id = ?",
            [
                name,
                description,
                price,
                discountPrice || price,
                stock,
                categoryId,
                brandId,
                seller || "Flipkart",
                productId,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Error updating product",
        });
    }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        await pool.query("DELETE FROM products WHERE id = ?", [productId]);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting product",
        });
    }
};

// Get product reviews
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const [reviews] = await pool.query(
            "SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.createdAt DESC",
            [productId]
        );

        res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
        });
    }
};

// Add product review
export const addProductReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Please provide rating and comment",
            });
        }

        // Check if user already reviewed this product
        const [existing] = await pool.query(
            "SELECT id FROM reviews WHERE product_id = ? AND user_id = ?",
            [productId, userId]
        );

        if (existing.length > 0) {
            // Update existing review
            await pool.query(
                "UPDATE reviews SET rating = ?, comment = ? WHERE product_id = ? AND user_id = ?",
                [rating, comment, productId, userId]
            );
        } else {
            // Create new review
            await pool.query(
                "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
                [productId, userId, rating, comment]
            );
        }

        // Update product rating
        const [ratings] = await pool.query(
            "SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE product_id = ?",
            [productId]
        );

        await pool.query(
            "UPDATE products SET rating = ?, ratingCount = ? WHERE id = ?",
            [ratings[0].avgRating || 0, ratings[0].count || 0, productId]
        );

        res.status(201).json({
            success: true,
            message: "Review added successfully",
        });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({
            success: false,
            message: "Error adding review",
        });
    }
};
