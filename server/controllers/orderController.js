import pool from "../config/database.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
            order.orderItems = items;
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

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const [orders] = await pool.query(
            `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const order = orders[0];

        const [items] = await pool.query(
            `SELECT oi.*, p.name, p.images FROM order_items oi
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
        );

        order.orderItems = items;

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching order",
        });
    }
};

// Create checkout session (Stripe)
export const createCheckoutSession = async (req, res) => {
    try {
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
                    images: [product.image],
                    description: `Brand: ${product.brandName}`,
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

// Verify payment and create order
export const verifyPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sessionId, products, shippingAddress } = req.body;

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

        for (let product of products) {
            totalPrice += product.price * product.quantity;
            totalPriceAfterDiscount +=
                product.discountPrice * product.quantity;
        }

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
                JSON.stringify(shippingAddress),
            ]
        );

        const newOrderId = orderResult.insertId;

        // Add order items
        for (let product of products) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price, discountPrice)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    newOrderId,
                    product.productId,
                    product.quantity,
                    product.price,
                    product.discountPrice,
                ]
            );

            // Update product stock
            await pool.query(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [product.quantity, product.productId]
            );
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                orderId,
                id: newOrderId,
            },
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment",
        });
    }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.name as userName, u.email
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             ORDER BY o.createdAt DESC`
        );

        // Get order items for each order
        for (let order of orders) {
            const [items] = await pool.query(
                `SELECT oi.*, p.name FROM order_items oi
                 LEFT JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.orderItems = items;
        }

        res.status(200).json({
            success: true,
            total: orders.length,
            orders,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
        });
    }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, notes } = req.body;

        if (!orderStatus) {
            return res.status(400).json({
                success: false,
                message: "Please provide order status",
            });
        }

        await pool.query(
            `UPDATE orders SET orderStatus = ?, notes = ? WHERE id = ?`,
            [orderStatus, notes || null, orderId]
        );

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Error updating order status",
        });
    }
};

// Delete all orders (admin)
export const deleteAllOrders = async (req, res) => {
    try {
        // Delete order items first
        await pool.query("DELETE FROM order_items");
        // Delete orders
        await pool.query("DELETE FROM orders");

        res.status(200).json({
            success: true,
            message: "All orders deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting orders:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting orders",
        });
    }
};
