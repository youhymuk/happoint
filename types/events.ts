import { EventTable } from '@/drizzle/schema';

export type PublicEventType = Omit<
	typeof EventTable.$inferSelect,
	'isActive'
> & { isActive: true };
