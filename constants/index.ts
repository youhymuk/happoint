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
	{ label: 'Events', route: '/events' },
	{ label: 'Schedule', route: '/schedule' },
	{ label: 'Public Profile', route: '/book' },
] as const;
