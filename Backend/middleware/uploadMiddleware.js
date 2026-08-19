import multer from "multer";

const storage = multer.memoryStorage();

export const uploadResource = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB maximum file size
  },
  fileFilter: (req, file, cb) => {
    // Allow PDFs, documents, images, videos, zip archives
    cb(null, true);
  },
});
