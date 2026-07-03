import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import AppError from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

export const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, tags } = req.body;

  const newPost = await Post.create({
    title,
    content,
    tags,
    author: req.user?._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

export const getPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Filtering and Search
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let query = Post.find(queryObj);

  // Search by text index (title and content)
  if (req.query.search) {
    query = query.find({ $text: { $search: req.query.search as string } });
  }

  // Pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit).populate('author', 'username email');

  // Execute Query
  const posts = await query;
  const total = await Post.countDocuments(query.getFilter());

  res.status(200).json({
    status: 'success',
    results: posts.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
    data: {
      posts,
    },
  });
});

export const getPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.id).populate('author', 'username email');

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

export const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Ownership restriction check
  if (post.author.toString() !== req.user?._id.toString()) {
    return next(new AppError('You do not have permission to edit this post', 403));
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      post: updatedPost,
    },
  });
});

export const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Ownership restriction check
  if (post.author.toString() !== req.user?._id.toString()) {
    return next(new AppError('You do not have permission to delete this post', 403));
  }

  await post.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
