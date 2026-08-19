import bcrypt from "bcryptjs";
import Admin from "../../model/admin.model.js";
import mongoose from "mongoose";
import ROLES from "../../constants/roles.js";
import sendEmail from "../../utils/sendEmail.js";
import { getAdminWelcomeEmailHtml } from "../../utils/emailTemplates.js";

// ---------- GET ELIGIBLE MENTORS ----------
export const getEligibleMentors = async (req, res) => {
  try {
    // Return only active admin/mentor accounts (excluding Super Admins)
    const superAdminRoles = [
      ROLES.SUPER_ADMIN,
      "SUPER_ADMIN",
      "super_admin",
      "Super Admin",
      "SUPERADMIN",
      "superadmin",
    ];

    const mentors = await Admin.find({
      status: "active",
      role: { $nin: superAdminRoles },
    })
      .select("_id firstName lastName email role status phoneNumber")
      .sort({ firstName: 1, lastName: 1 });

    return res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentors",
      error: error.message,
    });
  }
};

// ---------- CREATE ADMIN ----------
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber, status } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, password, and phone number are required.",
      });
    }

    const emailAddress = email.trim().toLowerCase();

    const existingAdmin = await Admin.findOne({ email: emailAddress });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailAddress,
      password: hashedPassword,
      role: role || ROLES.ADMIN,
      phoneNumber: phoneNumber.trim(),
      status: status || "active",
    });

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    // Send Onboarding Email
    try {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const displayRole = (role || ROLES.ADMIN).toUpperCase().replace(/[\s_]+/g, "") === "MENTOR" ? "Mentor" : "Administrator";
      await sendEmail({
        to: admin.email,
        subject: `Welcome to Saylani Bootcamp LMS - Your ${displayRole} Credentials`,
        html: getAdminWelcomeEmailHtml({
          firstName: admin.firstName || "Admin",
          email: admin.email,
          password: password,
          role: displayRole,
          loginLink: `${clientUrl}/login`,
        }),
      });
    } catch (emailError) {
      console.warn("Failed to send admin welcome email:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: adminResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

// ---------- GET ALL ADMINS ----------
export const getAllAdmins = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }],
      };
    }

    if (role) query.role = role;
    if (status) query.status = status;

    const admins = await Admin.find(query).select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
      error: error.message,
    });
  }
};

// ---------- GET ADMIN BY ID ----------
export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid admin ID" });
    }

    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin",
      error: error.message,
    });
  }
};

// ---------- UPDATE ADMIN ----------
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid admin ID" });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const { firstName, lastName, email, password, role, phoneNumber, status } = req.body;

    if (email && email.toLowerCase() !== admin.email) {
      const existingEmail = await Admin.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
      if (existingEmail) {
        return res.status(409).json({ success: false, message: "Email already exists" });
      }
    }

    if (firstName) admin.firstName = firstName.trim();
    if (lastName) admin.lastName = lastName.trim();
    if (email) admin.email = email.toLowerCase().trim();
    if (phoneNumber) admin.phoneNumber = phoneNumber.trim();
    if (role) admin.role = role;
    if (status) admin.status = status;

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: adminResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update admin",
      error: error.message,
    });
  }
};

// ---------- DELETE ADMIN ----------
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid admin ID" });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    await Admin.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete admin",
      error: error.message,
    });
  }
};
