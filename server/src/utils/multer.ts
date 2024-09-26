// src\utils\multer.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

export const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.tiff'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
};

const storage = multer.diskStorage({});

const multerConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
}).fields([
  { name: 'images', maxCount: 3 }, // Ensure this matches the frontend
]);


export default multerConfig;
