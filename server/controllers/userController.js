import pool from "../config/database.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query(
            "SELECT id, name, email, phone, role, isActive, createdAt FROM users"
        );

        res.status(200).json({
            success: true,
            total: users.length,
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const [users] = await pool.query(
            "SELECT id, name, email, phone, role, isActive, createdAt FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user: users[0],
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user",
        });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, phone } = req.body;

        await pool.query(
            "UPDATE users SET name = ?, phone = ? WHERE id = ?",
            [name, phone, userId]
        );

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user profile",
        });
    }
};

// Deactivate account
export const deactivateAccount = async (req, res) => {
    try {
        const { userId } = req.params;

        await pool.query(
            "UPDATE users SET isActive = false WHERE id = ?",
            [userId]
        );

        res.status(200).json({
            success: true,
            message: "Account deactivated successfully",
        });
    } catch (error) {
        console.error("Error deactivating account:", error);
        res.status(500).json({
            success: false,
            message: "Error deactivating account",
        });
    }
};

// Get user addresses
export const getUserAddresses = async (req, res) => {
    try {
        const { userId } = req.params;
        const [addresses] = await pool.query(
            "SELECT * FROM user_addresses WHERE user_id = ?",
            [userId]
        );

        res.status(200).json({
            success: true,
            addresses,
        });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching addresses",
        });
    }
};

// Add user address
export const addUserAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, phone, state, pincode, address, isDefault } = req.body;

        if (!name || !phone || !state || !pincode || !address) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // If marking as default, unset other defaults
        if (isDefault) {
            await pool.query(
                "UPDATE user_addresses SET isDefault = false WHERE user_id = ?",
                [userId]
            );
        }

        const [result] = await pool.query(
            "INSERT INTO user_addresses (user_id, name, phone, state, pincode, address, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [userId, name, phone, state, pincode, address, isDefault || false]
        );

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            addressId: result.insertId,
        });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({
            success: false,
            message: "Error adding address",
        });
    }
};

// Update user address
export const updateUserAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const { name, phone, state, pincode, address, isDefault } = req.body;

        if (isDefault) {
            await pool.query(
                "UPDATE user_addresses SET isDefault = false WHERE user_id = ?",
                [userId]
            );
        }

        await pool.query(
            "UPDATE user_addresses SET name = ?, phone = ?, state = ?, pincode = ?, address = ?, isDefault = ? WHERE id = ? AND user_id = ?",
            [name, phone, state, pincode, address, isDefault || false, addressId, userId]
        );

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
        });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({
            success: false,
            message: "Error updating address",
        });
    }
};

// Delete user address
export const deleteUserAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        await pool.query(
            "DELETE FROM user_addresses WHERE id = ? AND user_id = ?",
            [addressId, userId]
        );

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting address",
        });
    }
};

// Get user orders
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const [orders] = await pool.query(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC`,
            [userId]
        );

        // Get order items for each order
        for (let order of orders) {
            const [items] = await pool.query(
                `SELECT oi.*, p.name, p.discountPrice FROM order_items oi
                 LEFT JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.products = items;
        }

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
        });
    }
};

// Get user wishlist
export const getUserWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const [wishlistItems] = await pool.query(
            `SELECT w.id, w.product_id, p.* FROM wishlist w
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
            wishlistItems: wishlistItems.map(item => item.product_id),
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

// Get paginated wishlist products
export const getWishlistProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const offset = (page - 1) * pageSize;

        const [[{ total }]] = await pool.query(
            "SELECT COUNT(*) as total FROM wishlist WHERE user_id = ?",
            [userId]
        );

        const [wishlistItems] = await pool.query(
            `SELECT p.* FROM wishlist w
             LEFT JOIN products p ON w.product_id = p.id
             WHERE w.user_id = ?
             LIMIT ? OFFSET ?`,
            [userId, pageSize, offset]
        );

        // Get images for each product
        for (let item of wishlistItems) {
            const [images] = await pool.query(
                "SELECT url FROM product_images WHERE product_id = ?",
                [item.id]
            );
            item.images = images;
        }

        res.status(200).json({
            success: true,
            wishlistItems,
            totalItems: total,
        });
    } catch (error) {
        console.error("Error fetching wishlist products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching wishlist products",
        });
    }
};

// Update wishlist (add/remove)
export const updateWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, type } = req.body;

        if (type === "add") {
            await pool.query(
                "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)",
                [userId, productId]
            );
        } else if (type === "remove") {
            await pool.query(
                "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
                [userId, productId]
            );
        }

        res.status(201).json({
            success: true,
            message: type === "add" ? "Added to wishlist" : "Removed from wishlist",
        });
    } catch (error) {
        console.error("Error updating wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Error updating wishlist",
        });
    }
};

// Create checkout session
export const createCheckoutSession = async (req, res) => {
    try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        
        const userId = req.user.id;
        const { products, frontendURL, customerEmail } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No products provided",
            });
        }

        // Create line items for Stripe
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.name,
                    images: product.image ? [product.image] : [],
                    description: `Brand: ${product.brandName || 'N/A'}`,
                },
                unit_amount: Math.round(product.discountPrice * 100),
            },
            quantity: product.quantity,
        }));

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            customer_email: customerEmail,
            success_url: `${frontendURL}/shipping/confirm?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendURL}/shipping/failed`,
            metadata: {
                userId: userId.toString(),
                products: JSON.stringify(products),
            },
        });

        res.status(200).json({
            success: true,
            session,
        });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({
            success: false,
            message: "Error creating checkout session",
        });
    }
};

// Handle payment success
export const paymentSuccess = async (req, res) => {
    try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        
        const userId = req.user.id;
        const { sessionId, orderItems } = req.body;

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment not completed",
            });
        }

        // Generate order ID
        const orderId = `ORDER-${Date.now()}`;

        // Calculate totals
        let totalPrice = 0;
        let totalPriceAfterDiscount = 0;

        for (let product of orderItems) {
            totalPrice += (product.price || product.discountPrice) * product.quantity;
            totalPriceAfterDiscount += product.discountPrice * product.quantity;
        }

        // Get shipping info from localStorage (sent from frontend)
        const shippingInfo = req.body.shippingInfo || {};

        // Create order
        const [orderResult] = await pool.query(
            `INSERT INTO orders (orderId, user_id, totalPrice, totalPriceAfterDiscount, orderStatus, paymentStatus, paymentMethod, transactionId, shippingAddress)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                orderId,
                userId,
                totalPrice,
                totalPriceAfterDiscount,
                "Processing",
                "Paid",
                "Stripe",
                session.id,
                JSON.stringify(shippingInfo),
            ]
        );

        const newOrderId = orderResult.insertId;

        // Add order items
        for (let product of orderItems) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price, discountPrice)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    newOrderId,
                    product.productId,
                    product.quantity,
                    product.price || product.discountPrice,
                    product.discountPrice,
                ]
            );
        }

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            order: {
                orderId,
                id: newOrderId,
            },
        });
    } catch (error) {
        console.error("Error processing payment success:", error);
        res.status(500).json({
            success: false,
            message: "Error processing payment",
        });
    }
};
