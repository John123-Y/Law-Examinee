import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import AppError from '../utils/AppError';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only images are allowed', 400), false);
    }
  }
});

export default upload;