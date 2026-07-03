import { Router } from 'express';
import { createPost, getPosts, getPost, updatePost, deletePost } from '../controllers/post.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';

const router = Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes (require auth)
router.use(protect);
router.post('/', validate(createPostSchema), createPost);
router.patch('/:id', validate(updatePostSchema), updatePost);
router.delete('/:id', deletePost);

export default router;
