import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../../model/admin.model.js";
import Student from "../../model/student.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  generateResetToken,
} from "../../utils/token.js";
import sendEmail from "../../utils/sendEmail.js";
import cloudinary, { uploadToCloudinary } from "../../config/cloudinary.js";

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or Roll number and password are required",
      });
    }

    const identifier = String(email).trim();
    const emailAddress = identifier.toLowerCase();

    // 1. First, search for Admin or Super Admin by email
    let user = await Admin.findOne({ email: emailAddress }).select("+password");

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Check if there is also a Student account with this email/rollNumber
        const studentUser = await Student.findOne({
          $or: [
            { email: emailAddress },
            { rollNumber: identifier },
            { rollNumber: emailAddress.toUpperCase() },
          ],
        }).select("+password");

        if (studentUser) {
          const studentMatch = await bcrypt.compare(password, studentUser.password);
          if (studentMatch) {
            user = studentUser;
          } else {
            return res.status(401).json({
              success: false,
              message: "Invalid email/roll number or password",
            });
          }
        } else {
          return res.status(401).json({
            success: false,
            message: "Invalid email/roll number or password",
          });
        }
      }
    } else {
      // 2. If not Admin, search for Student by email OR rollNumber (case-insensitive)
      user = await Student.findOne({
        $or: [
          { email: emailAddress },
          { rollNumber: identifier },
          { rollNumber: { $regex: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        ],
      }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    }

    // Check account status
    if (user.status && user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Generate JWT
    const token = generateAccessToken(user);

    // Generate Refresh Token & Cookie
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
        // ================= USER PAYLOAD (UPDATED WITH PROFILE DETAILS) =================
        user: {
          id: user._id,
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role || (user.rollNumber ? "STUDENT" : "ADMIN"),
          rollNumber: user.rollNumber,
          phoneNumber: user.phoneNumber || user.phone || "",
          phone: user.phoneNumber || user.phone || "",
          profilePicture: user.profilePicture || user.profileImage || "",
          profileImage: user.profilePicture || user.profileImage || "",
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          batchId: user.batchId,
          mentorId: user.mentorId,
          status: user.status || "active",
        },
        // ===============================================================================
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

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (!decoded.userId || decoded.tokenVersion === undefined) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

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

    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is no longer valid",
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

// FORGOT PASSWORD 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const emailAddress = email.trim().toLowerCase();

    let user = await Admin.findOne({ email: emailAddress });

    if (!user) {
      user = await Student.findOne({ email: emailAddress });
    }

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
          <h2>Password Reset Request</h2>
          <p>Hello ${user.firstName},</p>
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

// RESET PASSWORD 
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

    let user = await Admin.findOne({
      resetPasswordTokenHash: hashedToken,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      user = await Student.findOne({
        resetPasswordTokenHash: hashedToken,
        resetPasswordExpiresAt: { $gt: new Date() },  //gt => mongodb operater hai
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    //  Tokens ko null kar do taake link doosri baar kaam na kare
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;

    if (user.role === "STUDENT" && user.status !== "active") {
      user.status = "active";
    }

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
};


// ---------- CHANGE PASSWORD ----------
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    //  Check karo user ne purana password sahi enter kiya hai ya nahi
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

// ---------- REGISTER STUDENT ----------
export const register = async (req, res) => {
  try {
    const {
      rollNumber,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      batchId,
      mentorId,
    } = req.body;

    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists.",
      });
    }

    const existingRollNumber = await Student.findOne({
      rollNumber,
    });

    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists.",
      });
    }

    // Generate temporary password and setup token
    const tempPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const setupToken = generateResetToken();
    const hashedSetupToken = hashToken(setupToken);
    const setupTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const student = await Student.create({
      rollNumber,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber,
      gender,
      dateOfBirth,
      batchId,
      mentorId,
      status: "active",
      password: hashedPassword,
      resetPasswordTokenHash: hashedSetupToken,
      resetPasswordExpiresAt: setupTokenExpiresAt,
    });

    // Send setup email
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const setupLink = `${clientUrl}/reset-password?token=${setupToken}`;

    await sendEmail({
      to: student.email,
      subject: "Welcome to Bootcamp LMS - Setup Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2>Welcome to Bootcamp LMS, ${student.firstName}!</h2>
          <p>Your student account has been successfully created.</p>
          <p>Please click the link below to set up your password and log in:</p>
          <p><a href="${setupLink}">${setupLink}</a></p>
          <p><i>This link will expire in 7 days.</i></p>
        </div>
      `,
    });

    const studentResponse = student.toObject();
    delete studentResponse.password;

    return res.status(201).json({
      success: true,
      message: "Student registered successfully. Setup email sent.",
      data: studentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================================
// GET PROFILE (AUTHENTICATED USER: SUPER ADMIN, ADMIN, STUDENT) - ADDED
// =========================================================================
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = {
      id: user._id,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role || (user.rollNumber ? "STUDENT" : "ADMIN"),
      rollNumber: user.rollNumber,
      phoneNumber: user.phoneNumber || user.phone || "",
      phone: user.phoneNumber || user.phone || "",
      profilePicture: user.profilePicture || user.profileImage || "",
      profileImage: user.profilePicture || user.profileImage || "",
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      batchId: user.batchId,
      mentorId: user.mentorId,
      status: user.status || "active",
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      data: { user: userData },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================================
// UPDATE PROFILE (AUTHENTICATED USER: SUPER ADMIN, ADMIN, STUDENT) - ADDED
// =========================================================================
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let {
      firstName,
      lastName,
      phoneNumber,
      phone,
      profilePicture,
      profileImage,
      gender,
      dateOfBirth,
    } = req.body;

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phoneNumber || phone) user.phoneNumber = (phoneNumber || phone).trim();

    // 1. If file is uploaded via multipart/form-data
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "saylani_lms/profiles",
          resource_type: "image",
          public_id: `profile_${user._id}_${Date.now()}`,
        });
        user.profilePicture = uploadResult.secure_url || uploadResult.url;
      } catch (uploadErr) {
        console.error("Cloudinary profile upload error:", uploadErr);
      }
    }
    // 2. If Base64 string or image URL is passed in request body
    else if (profilePicture || profileImage) {
      const pic = profilePicture || profileImage;
      if (typeof pic === "string" && pic.startsWith("data:image/")) {
        try {
          const uploadResult = await cloudinary.uploader.upload(pic, {
            folder: "saylani_lms/profiles",
            resource_type: "image",
            public_id: `profile_${user._id}_${Date.now()}`,
          });
          user.profilePicture = uploadResult.secure_url || uploadResult.url;
        } catch (uploadErr) {
          console.error("Cloudinary profile base64 upload error:", uploadErr);
          user.profilePicture = pic;
        }
      } else if (typeof pic === "string") {
        user.profilePicture = pic;
      }
    }

    // Student-specific fields update
    if (user.role === "STUDENT" || user.rollNumber) {
      if (gender) user.gender = gender;
      if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    }

    await user.save();

    const updatedUser = {
      id: user._id,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role || (user.rollNumber ? "STUDENT" : "ADMIN"),
      rollNumber: user.rollNumber,
      phoneNumber: user.phoneNumber || user.phone || "",
      phone: user.phoneNumber || user.phone || "",
      profilePicture: user.profilePicture || user.profileImage || "",
      profileImage: user.profilePicture || user.profileImage || "",
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      batchId: user.batchId,
      mentorId: user.mentorId,
      status: user.status || "active",
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
