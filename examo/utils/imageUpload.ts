import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadImage = async (file: 'Express.Multer.File'): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'exam-app/courses' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream('file.buffer').pipe(stream);
  });
};