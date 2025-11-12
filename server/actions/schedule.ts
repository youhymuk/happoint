'use server';

import { db } from '@/drizzle/db';
import { AvailabilityTable, ScheduleTable } from '@/drizzle/schema';
import {
	addMinutes,
	areIntervalsOverlapping,
	format,
	isWithinInterval,
	setHours,
	setMinutes,
} from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { eq } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';
import { revalidatePath } from 'next/cache';

import { ScheduleFormDataType } from '@/components/forms/ScheduleForm';
import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';
import { parseTime } from '@/lib/formatters';
import { scheduleFormSchema } from '@/schema/schedule';
import { EventType } from '@/types/events';
import type { AvailabilityRow, Schedule } from '@/types/schedule';
import { getCalendarEvents as getCalendarEventsTimeRanges } from '../google/googleCalendar';
import { requireUserId, ValidationError } from '../utils';
import { withErrorHandling } from './events';

export async function getSchedule(userId: string) {
	return withErrorHandling(
		async () => {
			const schedule = await db.query.ScheduleTable.findFirst({
				where: eq(ScheduleTable.clerkUserId, userId),
				with: {
					availabilities: true,
				},
			});

			return schedule as Schedule | undefined;
		},
		'get schedule',
		false
	);
}

export async function saveSchedule(formData: ScheduleFormDataType) {
	return withErrorHandling(
		async () => {
			const userId = await requireUserId();

			const { success, data } = scheduleFormSchema.safeParse(formData);

			if (!success) throw new ValidationError('Invalid data');

			const { availabilities, ...scheduleData } = data;

			const [{ id: scheduleId }] = await db
				.insert(ScheduleTable)
				.values({
					...scheduleData,
					clerkUserId: userId,
				})
				.onConflictDoUpdate({
					target: [ScheduleTable.clerkUserId],
					set: scheduleData,
				})
				.returning({ id: ScheduleTable.id });

			const statements: [BatchItem<'pg'>] = [
				db
					.delete(AvailabilityTable)
					.where(eq(AvailabilityTable.scheduleId, scheduleId)),
			];

			if (availabilities.length) {
				statements.push(
					db.insert(AvailabilityTable).values(
						availabilities.map((availability) => ({
							...availability,
							scheduleId,
						}))
					)
				);
			}

			await db.batch(statements);

			revalidatePath('/schedule'); //TODO: refactor withErrorHandling to pass revalidatePath as a parameter
		},
		'save schedule',
		false
	);
}

export async function getValidScheduleTimeSlots(
	slots: Date[],
	event: EventType
) {
	const { clerkUserId, durationInMinutes } = event;

	const start = slots[0];
	const end = slots.at(-1);

	if (!start || !end) return [];

	const schedule = await getSchedule(clerkUserId);

	if (!schedule) return [];

	const groupedAvailabilities = Object.groupBy(
		schedule.availabilities,
		(a) => a.dayOfWeek
	);

	const eventsTimeRanges = await getCalendarEventsTimeRanges(clerkUserId, {
		start,
		end,
	});

	return slots.filter((slot) => {
		const availabilities = getAvailabilities(
			groupedAvailabilities,
			slot,
			schedule.timezone
		);

		const newEventTimeRange = {
			start: slot,
			end: addMinutes(slot, durationInMinutes),
		};

		return (
			eventsTimeRanges.every((eventTimeRange) => {
				return !areIntervalsOverlapping(newEventTimeRange, eventTimeRange, {
					inclusive: true,
				});
			}) &&
			availabilities.some(
				(availability: { start: Date; end: Date }) =>
					isWithinInterval(newEventTimeRange.start, availability) &&
					isWithinInterval(newEventTimeRange.end, availability)
			)
		);
	});
}

function getAvailabilities(
	groupedAvailabilities: Partial<
		Record<(typeof DAYS_OF_WEEK_IN_ORDER)[number], AvailabilityRow[]>
	>,
	date: Date,
	timezone: string
) {
	const dayOfWeek = format(
		date,
		'EEEE'
	).toLowerCase() as (typeof DAYS_OF_WEEK_IN_ORDER)[number];

	if (!dayOfWeek) return [];

	const dayAvailabilities = groupedAvailabilities[dayOfWeek];

	if (!dayAvailabilities) return [];

	return dayAvailabilities.map(({ startTime, endTime }) => {
		const [startHour, startMinute] = parseTime(startTime);
		const [endHour, endMinute] = parseTime(endTime);

		return {
			start: fromZonedTime(
				setMinutes(setHours(date, startHour), startMinute),
				timezone
			),
			end: fromZonedTime(
				setMinutes(setHours(date, endHour), endMinute),
				timezone
			),
		};
	});
}
