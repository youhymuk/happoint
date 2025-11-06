import { z } from 'zod';

export const eventFormSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long' }),
	description: z.string().optional(),
	isActive: z.boolean(),
	durationInMinutes: z
		.number()
		.int()
		.positive({ message: 'Duration must be greater than 0' })
		.max(60 * 12, { message: 'Duration must be less than 12 hours' })
		.refine((value) => value % 15 === 0, {
			message: 'Duration must be a multiple of 15 minutes',
		}),
});
