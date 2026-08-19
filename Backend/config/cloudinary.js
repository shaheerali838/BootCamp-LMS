import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL.trim(),
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? String(process.env.CLOUDINARY_CLOUD_NAME).trim() : undefined,
    api_key: process.env.CLOUDINARY_API_KEY ? String(process.env.CLOUDINARY_API_KEY).trim() : undefined,
    api_secret: process.env.CLOUDINARY_API_SECRET ? String(process.env.CLOUDINARY_API_SECRET).trim() : undefined,
  });
}

/**
 * Uploads a file buffer to Cloudinary using stream
 * @param {Buffer} fileBuffer 
 * @param {Object} options 
 * @returns {Promise<Object>}
 */
export const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "saylani_lms/resources",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Deletes a file from Cloudinary by public ID
 * @param {string} publicId 
 * @param {string} resourceType 
 * @returns {Promise<Object>}
 */
export const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
    // Also attempt deleting with "image" or "auto" if "raw" fails
    try {
      return await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch {
      return null;
    }
  }
};

export default cloudinary;
