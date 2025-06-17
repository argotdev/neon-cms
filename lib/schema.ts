import { z } from 'zod';

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  body: z.string().min(1),
  tags: z.array(z.string()).min(1),
});

export type Post = z.infer<typeof postSchema>; 