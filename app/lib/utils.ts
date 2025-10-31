import { auth } from '@clerk/nextjs/server';

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

export function formatError(error: unknown, action: string): Error {
	return new Error(
		`Failed to ${action}: ${error instanceof Error ? error.message : error}`
	);
}

export async function getAuthenticatedUserId(): Promise<string> {
	const { userId } = await auth();

	if (!userId) throw new ValidationError('Unauthorized');

	return userId;
}
