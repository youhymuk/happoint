import { EventTable } from '@/drizzle/schema';

export type EventType = typeof EventTable.$inferSelect;

export type PublicEventType = Omit<EventType, 'isActive'> & { isActive: true };
