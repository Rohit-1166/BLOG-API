import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return res.status(400).json({ status: 'error', message });
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const value = error.errmsg ? error.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'field';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return res.status(400).json({ status: 'error', message });
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((val: any) => val.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return res.status(400).json({ status: 'error', message });
  }

  // Fallback for unhandled errors
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};
