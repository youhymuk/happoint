export function timeToDecimal(time: string): number {
	const [hours, minutes] = time.split(':').map(Number);

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
