import cloudinary, { uploadImage } from '@/config/cloudinary';
import { AuthenticatedRequest } from '@/interfaces/auth';
import { UserModel } from '@/models/user';
import { IUser } from '@/schemas/auth';
import { getPublicId } from '@/utils/cloudinary';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';

const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as unknown as AuthenticatedRequest).user as IUser;
    let publicId: string | null = null;
    if (!req.file) {
      throw new CustomError('No file uploaded', 400);
    }

    if (user.avatar) {
      publicId = getPublicId(
        user.avatar,
        String(process.env.CLOUDINARY_FOLDER)
      );
    }

    const uploadResult = await uploadImage(req.file, `avatar/${user._id}`);

    if (publicId) {
      const destroyResult = await cloudinary.uploader.destroy(publicId);
      if (destroyResult.result !== 'ok') {
        throw new CustomError('Avatar uploaded failed', 400);
      }
    }

    const upload = await UserModel.findByIdAndUpdate(
      user._id,
      { avatar: uploadResult.secure_url },
      { new: true }
    );

    if (!upload) {
      await cloudinary.uploader.destroy(uploadResult.public_id);
      throw new CustomError('Avatar uploaded failed', 400);
    }

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
};

export default uploadAvatar;
