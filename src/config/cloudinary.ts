import { CustomError } from '@/utils/errorUtils';
import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadImage = (
  file: Express.Multer.File,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    if (!file.mimetype.startsWith('image/')) {
      return reject(new CustomError('Only image files are allowed', 400));
    }
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${process.env.CLOUDINARY_FOLDER}/${folder}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(file.buffer);
  });
};

export default cloudinary;
