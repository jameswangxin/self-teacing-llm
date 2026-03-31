import { defineCollection, z } from 'astro:content';

const modules = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^\d\.\d$/)
  })
});

export const collections = { modules };
