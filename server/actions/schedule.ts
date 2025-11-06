'use server';

import { db } from '@/drizzle/db';
import { AvailabilityTable, ScheduleTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

import { ScheduleFormDataType } from '@/components/forms/ScheduleForm';
import { scheduleFormSchema } from '@/schema/schedule';
import type { Schedule } from '@/types/schedule';
import { BatchItem } from 'drizzle-orm/batch';
import { revalidatePath } from 'next/cache';
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
