import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
            tokenVersion: user.tokenVersion,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30m",
        }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            tokenVersion: user.tokenVersion,
            type: "refresh",
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

export const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

export const generateResetToken = () => {
    return crypto.randomBytes(32).toString("hex");
};