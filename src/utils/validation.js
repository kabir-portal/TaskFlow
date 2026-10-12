import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or fewer'),
  description: z.string().max(2000, 'Description must be 2000 characters or fewer').optional().default(''),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigneeId: z.string().optional().default(''),
  columnId: z.string().optional(),
  projectId: z.string().optional(),
  labels: z.array(z.string()).optional().default([]),
  startDate: z.string().optional().default(''),
  dueDate: z.string().optional().default(''),
  estimatedEffort: z.string().optional().default(''),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name must be 100 characters or fewer'),
  description: z.string().max(500).optional().default(''),
  color: z.string().default('#3b82f6'),
  dueDate: z.string().optional().default(''),
});

export function validateDateRange(startDate, dueDate) {
  if (startDate && dueDate) {
    return new Date(startDate) <= new Date(dueDate);
  }
  return true;
}
