import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../model/admin.model.js";
import Student from "../../model/student.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  generateResetToken,
} from "../../utils/token.js";
import sendEmail from "../../utils/sendEmail.js";

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const emailAddress = email.toLowerCase();

    // First, search for Admin or Super Admin
    let user = await Admin.findOne({ email: emailAddress });

    // If not found, search for Student
    if (!user) {
      user = await Student.findOne({ email: emailAddress });
    }

    // User does not exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check account status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateAccessToken(user);

    // Generate Refresh Token & Cookie (From Nabeel's Branch)
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- LOGOUT ----------
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- REFRESH TOKEN ----------
// TODO: Update this later to search Student model as well (Context Issue #26)
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    let user;

    // Try Admin / Super Admin first
    user = await Admin.findById(decoded.userId).select("-password");

    // If not found, try Student
    if (!user) {
      user = await Student.findById(decoded.userId).select("-password");
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

// ---------- FORGOT PASSWORD ----------
// TODO: Update this later to search Student model as well (Context Issue #26)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const resetToken = generateResetToken();
    admin.resetPasswordTokenHash = hashToken(resetToken);
    admin.resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await admin.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: admin.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${admin.firstName},</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
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
// TODO: Update this later to search Student model as well (Context Issue #26)
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const hashedToken = hashToken(token);

    const admin = await Admin.findOne({
      resetPasswordTokenHash: hashedToken,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordTokenHash = null;
    admin.resetPasswordExpiresAt = null;
    await admin.save();

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
};

// ---------- CHANGE PASSWORD ----------
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user; // Comes from authMiddleware, handles Admin and Student

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
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
