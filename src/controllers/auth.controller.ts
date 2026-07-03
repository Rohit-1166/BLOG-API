import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('Email already in use', 400));
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return next(new AppError('Username already taken', 400));
  }

  const newUser = await User.create({
    username,
    email,
    password,
  });

  const token = signToken(newUser._id as string);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id as string);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    },
  });
});
