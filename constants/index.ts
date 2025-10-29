export const DAYS_OF_WEEK_IN_ORDER = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
] as const;

export const PrivateRoutesConfig = [
	{ imgUrl: '/icons/events.svg', label: 'Events', route: '/events' },
	{ imgUrl: '/icons/schedule.svg', label: 'Schedule', route: '/schedule' },
	{ imgUrl: '/icons/book.svg', label: 'Public Profile', route: '/book' },
] as const;
