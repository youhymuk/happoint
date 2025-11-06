import { z } from 'zod';

import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';
import { timeToDecimal } from '@/lib/formatters';

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
const timeValidationMessage = 'Time must be in the format HH:MM';

export const scheduleFormSchema = z.object({
	timezone: z.string().min(1, { message: 'Timezone is required' }),
	availabilities: z
		.array(
			z.object({
				dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
				startTime: z.string().regex(timeRegex, {
					message: timeValidationMessage,
				}),
				endTime: z.string().regex(timeRegex, {
					message: timeValidationMessage,
				}),
			})
		)
		.superRefine((availabilities, ctx) => {
			availabilities.forEach((availability, index) => {
				const hasOverlap = availabilities.some((a, i) => {
					if (i === index) return false; // Skip checking the same availability
					if (a.dayOfWeek !== availability.dayOfWeek) return false; // Skip checking different days

					return (
						timeToDecimal(a.startTime) < timeToDecimal(availability.endTime) &&
						timeToDecimal(a.endTime) > timeToDecimal(availability.startTime)
					);
				});

				if (hasOverlap) {
					ctx.addIssue({
						code: 'custom',
						message: 'Availability overlaps with another',
						path: [index],
					});
				}

				if (
					timeToDecimal(availability.startTime) >=
					timeToDecimal(availability.endTime)
				) {
					ctx.addIssue({
						code: 'custom',
						message: 'End time must be after start time',
						path: [index],
					});
				}
			});
		}),
});
