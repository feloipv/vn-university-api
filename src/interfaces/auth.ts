import { IUser } from '@/schemas/auth';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
