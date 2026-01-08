import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

// Register user
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Check if email already exists
        const [existingUser] = await pool.query(
            "SELECT email FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create user
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, phone || null]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: result.insertId,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Error during registration",
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find user
        const [users] = await pool.query(
            "SELECT id, name, email, password, phone, role FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User not Registered!",
                errorType: "invalidUser",
            });
        }

        const user = users[0];

        // Compare password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Wrong password!",
                errorType: "invalidPassword",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Error during login",
        });
    }
};

// Check user auth
export const checkUserAuth = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await pool.query(
            "SELECT id, name, email, phone, role FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User not found",
                ok: false,
            });
        }

        res.status(200).json({
            success: true,
            ok: true,
            user: users[0],
        });
    } catch (error) {
        console.error("Auth check error:", error);
        res.status(401).json({
            success: false,
            ok: false,
            message: "Auth check failed",
        });
    }
};

// Check admin auth
export const checkAdminAuth = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await pool.query(
            "SELECT id, name, email, phone, role FROM users WHERE id = ? AND role = 1",
            [userId]
        );

        if (users.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
                ok: false,
            });
        }

        res.status(200).json({
            success: true,
            ok: true,
            user: users[0],
        });
    } catch (error) {
        console.error("Admin auth check error:", error);
        res.status(401).json({
            success: false,
            ok: false,
            message: "Admin auth check failed",
        });
    }
};

// Forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email",
            });
        }

        const [users] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { id: users[0].id, email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // In production, send this token via email
        res.status(200).json({
            success: true,
            message: "Password reset link sent to email",
            resetToken, // In production, don't send this directly
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Error processing forgot password request",
        });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide reset token and new password",
            });
        }

        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, decoded.id]
        );

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Error resetting password",
        });
    }
};

// Update user details (name, email, phone)
export const updateDetails = async (req, res) => {
    try {
        const { email, newName, newEmail, newPhone } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required to identify user",
            });
        }

        // Find user by email
        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const user = users[0];

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (newName) {
            updates.push("name = ?");
            values.push(newName);
        }
        if (newEmail) {
            updates.push("email = ?");
            values.push(newEmail);
        }
        if (newPhone) {
            updates.push("phone = ?");
            values.push(newPhone);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided",
            });
        }

        values.push(user.id);

        await pool.query(
            `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
            values
        );

        // Get updated user
        const [updatedUsers] = await pool.query(
            "SELECT id, name, email, phone, role FROM users WHERE id = ?",
            [user.id]
        );

        res.status(200).json({
            success: true,
            message: "Details updated successfully",
            user: updatedUsers[0],
        });
    } catch (error) {
        console.error("Update details error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating details",
        });
    }
};
