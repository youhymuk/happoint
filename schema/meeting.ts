import { startOfDay } from 'date-fns';
import { z } from 'zod';

export const baseMeetingSchema = z.object({
	startTime: z.date().min(new Date()),
	timezone: z.string().min(1, 'Required'),
	guestName: z.string().min(1, 'Required'),
	guestEmail: z.string().email().min(1, 'Required'),
	guestNotes: z.string().optional(),
});

export const meetingFormSchema = baseMeetingSchema.extend({
	date: z.date().min(startOfDay(new Date()), 'Must be today or later'),
});

export const meetingActionSchema = meetingFormSchema
	.omit({ date: true })
	.extend({
		eventId: z.string().min(1, 'Required'),
		clerkUserId: z.string().min(1, 'Required'),
	});
