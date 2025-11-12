'use server';

import { z } from 'zod';

import { db } from '@/drizzle/db';
import { EventTable } from '@/drizzle/schema';
import { meetingActionSchema } from '@/schema/meeting';
import { toZonedTime } from 'date-fns-tz';
import { and, eq } from 'drizzle-orm';
import { createGoogleCalendarEvent } from '../google/googleCalendar';
import { ValidationError } from '../utils';
import { getValidScheduleTimeSlots } from './schedule';

export async function createMeeting(
	formData: z.infer<typeof meetingActionSchema>
) {
	try {
		const parseResult = meetingActionSchema.safeParse(formData);
		if (!parseResult.success) {
			const errorMessages = parseResult.error.issues
				.map((err) => `${err.path.join('.')}: ${err.message}`)
				.join(', ');
			console.error('Validation errors:', errorMessages, parseResult.error);
			throw new ValidationError(
				`Invalid form data: ${errorMessages || 'Unknown validation error'}`
			);
		}
		const { data } = parseResult;

		const { eventId, clerkUserId } = formData;

		const event = await db.query.EventTable.findFirst({
			where: and(
				eq(EventTable.isActive, true),
				eq(EventTable.id, eventId),
				eq(EventTable.clerkUserId, clerkUserId)
			),
		});

		if (!event) throw new ValidationError('Event not found');

		const startInTimeZone = toZonedTime(data.startTime, data.timezone);
		const validSlots = await getValidScheduleTimeSlots(
			[startInTimeZone],
			event
		);

		if (!validSlots.length) throw new ValidationError('No valid slots found');

		// Create Google Calendar event (non-blocking - failures are logged but don't prevent meeting creation)
		createGoogleCalendarEvent({
			...data,
			startTime: startInTimeZone,
			durationInMinutes: event.durationInMinutes,
			eventName: event.name,
		}).catch((calendarError) => {
			console.warn(
				'Failed to create Google Calendar event (meeting still created):',
				calendarError
			);
		});

		return {
			clerkUserId: data.clerkUserId,
			eventId: data.eventId,
			startTime: data.startTime,
		};
	} catch (error) {
		console.error(`Error creating meeting:`, error);
		// Preserve ValidationError to show user-friendly messages
		if (error instanceof ValidationError) {
			throw error;
		}
		// Include actual error message for debugging
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		console.error('Full error details:', {
			message: errorMessage,
			formData,
			error,
		});
		throw new Error(`Failed to create meeting: ${errorMessage}`);
	}
}
