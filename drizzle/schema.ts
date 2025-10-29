import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';
import { relations } from 'drizzle-orm';
import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

const id = uuid('id').primaryKey().defaultRandom();
const createdAt = timestamp('createdAt').notNull().defaultNow();
const updatedAt = timestamp('updatedAt')
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date());

export const EventTable = pgTable(
	'events',
	{
		id,
		name: text('name').notNull(),
		description: text('description'),
		durationInMinutes: integer('durationInMinutes').notNull(),
		clerkUserId: text('clerkUserId').notNull(),
		isActive: boolean('isActive').notNull().default(true),
		createdAt,
		updatedAt,
	},
	(table) => [index('clerkUserIdIndex').on(table.clerkUserId)]
);

export const ScheduleTable = pgTable('schedules', {
	id,
	timezone: text('timezone').notNull(),
	clerkUserId: text('clerkUserId').notNull().unique(),
	createdAt,
	updatedAt,
});

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
	availabilities: many(AvailabilityTable),
}));

export const ScheduleDayOfWeek = pgEnum('day', DAYS_OF_WEEK_IN_ORDER);

export const AvailabilityTable = pgTable(
	'availabilities',
	{
		id,
		scheduleId: uuid('scheduleId')
			.notNull()
			.references(() => ScheduleTable.id, {
				onDelete: 'cascade',
			}),
		dayOfWeek: ScheduleDayOfWeek('dayOfWeek').notNull(),
		startTime: text('start').notNull(),
		endTime: text('end').notNull(),
	},
	(table) => [index('scheduleIdIndex').on(table.scheduleId)]
);

export const availabilityRelations = relations(
	AvailabilityTable,
	({ one }) => ({
		schedule: one(ScheduleTable, {
			fields: [AvailabilityTable.scheduleId],
			references: [ScheduleTable.id],
		}),
	})
);
