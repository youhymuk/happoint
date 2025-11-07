'use server';

import { and, desc, eq } from 'drizzle-orm';

import { EventFormDataType } from '@/components/forms/EventForm';
import { db } from '@/drizzle/db';
import { EventTable } from '@/drizzle/schema';
import { eventFormSchema } from '@/schema/event';
import { formatError, requireUserId, ValidationError } from '@/server/utils';
import { PublicEventType } from '@/types/events';
import { revalidatePath } from 'next/cache';

export async function withErrorHandling<T>(
	operation: () => Promise<T>,
	action: string,
	shouldRevalidate: boolean = true
): Promise<T> {
	try {
		const result = await operation();

		if (shouldRevalidate) revalidatePath('/events');

		return result;
	} catch (error) {
		if (error instanceof ValidationError) {
			throw error;
		}
		// Format only unexpected errors
		throw formatError(error, action);
	}
}

export async function deleteEvent(eventId: string) {
	await withErrorHandling(async () => {
		const userId = await requireUserId();

		await db
			.delete(EventTable)
			.where(
				and(eq(EventTable.id, eventId), eq(EventTable.clerkUserId, userId))
			);
	}, 'delete event');
}

export async function updateEvent(
	eventId: string,
	formData: EventFormDataType
) {
	await withErrorHandling(async () => {
		const userId = await requireUserId();

		const event = await db.query.EventTable.findFirst({
			where: ({ id, clerkUserId }) =>
				and(eq(id, eventId), eq(clerkUserId, userId)),
		});

		if (!event) throw new ValidationError('Event not found');

		await db
			.update(EventTable)
			.set({
				...formData,
			})
			.where(
				and(eq(EventTable.id, eventId), eq(EventTable.clerkUserId, userId))
			);
	}, 'update event');
}

export async function createEvent(formData: EventFormDataType) {
	await withErrorHandling(async () => {
		const userId = await requireUserId();

		const { success, data } = eventFormSchema.safeParse(formData);

		if (!success) throw new ValidationError('Invalid data');

		await db.insert(EventTable).values({
			...data,
			clerkUserId: userId,
		});
	}, 'create event');
}

export async function getEvents(userId: string) {
	return withErrorHandling(
		async () => {
			const events = await db.query.EventTable.findMany({
				where: eq(EventTable.clerkUserId, userId),
				orderBy: [desc(EventTable.createdAt)],
			});

			return events;
		},
		'get events',
		false
	);
}

export async function getEvent(eventId: string, userId: string) {
	return withErrorHandling(
		async () => {
			const event = await db.query.EventTable.findFirst({
				where: ({ id, clerkUserId }) =>
					and(eq(id, eventId), eq(clerkUserId, userId)),
			});

			return event;
		},
		'get event',
		false
	);
}

export async function getPublicEvents(clerkUserId: string) {
	return withErrorHandling(
		async () => {
			const events = await db.query.EventTable.findMany({
				where: and(
					eq(EventTable.clerkUserId, clerkUserId),
					eq(EventTable.isActive, true)
				),
				orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
			});

			return events as PublicEventType[];
		},
		'get events',
		false
	);
}
