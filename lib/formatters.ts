export function parseTime(time: string) {
	return time.split(':').map(Number) as [number, number];
}

export function timeToDecimal(time: string): number {
	const [hours, minutes] = parseTime(time);

	return hours + minutes / 60;
}

export function formatTimezoneOffset(timezone: string) {
	return Intl.DateTimeFormat(undefined, {
		timeZone: timezone,
		timeZoneName: 'shortOffset',
	})
		.formatToParts(new Date())
		.find((part) => part.type === 'timeZoneName')?.value;
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: 'medium',
	timeStyle: 'short',
});

export function formatDateTime(date: Date) {
	return dateTimeFormatter.format(date);
}
