export function parseLocalDate(date: string) {
	const [year, month, day] = date.split('-').map(Number);
	return new Date(year, month - 1, day);
}

export function toLocalDate(date: Date) {
	return date.toLocaleDateString('en-CA');
}
