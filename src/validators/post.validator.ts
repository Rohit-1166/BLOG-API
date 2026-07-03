import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .max(150, 'Title cannot exceed 150 characters'),
    content: z
      .string({
        required_error: 'Content is required',
      }),
    tags: z.array(z.string()).optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().max(150).optional(),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
