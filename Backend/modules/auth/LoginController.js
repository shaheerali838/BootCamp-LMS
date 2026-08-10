import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Users/UserModel.js";          // adjust path as needed
import {
    generateAccessToken,
    generateRefreshToken,
    hashToken,
    generateResetToken,
} from "../../utils/token.js";
import sendEmail from "../../utils/sendEmail.js";

// ---------- LOGIN (admin only) ----------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Restrict to admin (remove this check if you want student login)
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can login",
            });
        }

        // Check account status
        if (user.status !== "Active") {
            return res.status(403).json({
                success: false,
                message: "Account is inactive",
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token hash in DB
        user.refreshTokenHash = hashToken(refreshToken);
        user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await user.save();

        // Set refresh token in HTTP‑only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ---------- REFRESH TOKEN ----------
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required",
            });
        }

        // Verify the refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        if (decoded.type !== "refresh") {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare stored hash with the provided token
        if (!user.refreshTokenHash || user.refreshTokenHash !== hashToken(token)) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is invalid",
            });
        }

        if (!user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired",
            });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Update stored refresh token hash
        user.refreshTokenHash = hashToken(newRefreshToken);
        user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await user.save();

        // Set new refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
            accessToken: newAccessToken,
        });
    } catch (error) {
        // Handle JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ---------- FORGOT PASSWORD ----------
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }

        const resetToken = generateResetToken();
        user.resetPasswordTokenHash = hashToken(resetToken);
        user.resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hello ${user.firstName},</p>
                    <p>We received a request to reset your password. Please click the button below to set a new password. This link is valid for 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link in your browser:</p>
                    <p><a href="${resetLink}">${resetLink}</a></p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">Saylani Bootcamp LMS Team</p>
                </div>
            `,
        });

        return res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ---------- RESET PASSWORD ----------
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const hashedToken = hashToken(token);

        const user = await User.findOne({
            resetPasswordTokenHash: hashedToken,
            resetPasswordExpiresAt: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordTokenHash = null;
        user.resetPasswordExpiresAt = null;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};// ---------- CHANGE PASSWORD ----------
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect current password",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};