import type { AvailabilityTable, ScheduleTable } from '@/drizzle/schema';

type ScheduleRow = typeof ScheduleTable.$inferSelect;
type AvailabilityRow = typeof AvailabilityTable.$inferSelect;

export type Schedule = ScheduleRow & {
	availabilities: AvailabilityRow[];
};

