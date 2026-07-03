import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';
import User, { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; iat: number; exp: number };

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});
