import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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

//handles server actions/api routes
export async function requireUserId(): Promise<string> {
	const { userId } = await auth();

	if (!userId) throw new ValidationError('Unauthorized');

	return userId;
}

//handles client side navigation
export async function requireAuthWithRedirect(): Promise<{ userId: string }> {
	const { userId, redirectToSignIn } = await auth();

	if (!userId) redirect(redirectToSignIn?.() || '/login');

	return { userId };
}
