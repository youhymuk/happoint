'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { google } from 'googleapis';

export default async function getOAuthClient(clerkUserId: string) {
	try {
		const client = await clerkClient();
		const { data } = await client.users.getUserOauthAccessToken(
			clerkUserId,
			'google'
		);

		if (!data.length || !data[0].token)
			throw new Error('No OAuth data or token found for the user.');

		const {
			GOOGLE_OAUTH_CLIENT_ID,
			GOOGLE_OAUTH_CLIENT_SECRET,
			GOOGLE_OAUTH_REDIRECT_URL,
		} = process.env;
		const oAuthClient = new google.auth.OAuth2(
			GOOGLE_OAUTH_CLIENT_ID,
			GOOGLE_OAUTH_CLIENT_SECRET,
			GOOGLE_OAUTH_REDIRECT_URL
		);

		oAuthClient.setCredentials({ access_token: data[0].token });

		return oAuthClient;
	} catch {
		throw new Error('Failed to get OAuth client');
	}
}
