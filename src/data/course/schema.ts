import { z } from 'astro/zod';

export const CourseModuleSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  slug: z.string(),
  stageId: z.string(),
  summary: z.string(),
  estimatedTime: z.string(),
  prerequisites: z.array(z.string()),
  keyPoints: z.array(z.string()).min(3)
});

export const CourseStageSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  slug: z.string(),
  goal: z.string(),
  summary: z.string(),
  project: z.string(),
  moduleIds: z.array(z.string())
});

export type CourseModule = z.infer<typeof CourseModuleSchema>;
export type CourseStage = z.infer<typeof CourseStageSchema>;
