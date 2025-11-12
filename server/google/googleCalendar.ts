'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { addMinutes, endOfDay, startOfDay } from 'date-fns';
import { google } from 'googleapis';
import { z } from 'zod';

import { meetingActionSchema } from '@/schema/meeting';
import type { TimeRange } from '@/types/common';

export default async function getOAuthClient(clerkUserId: string) {
	try {
		const client = await clerkClient();
		const { data } = await client.users.getUserOauthAccessToken(
			clerkUserId,
			'google'
		);

		if (!data.length || !data[0].token) {
			console.warn('No OAuth data or token found for the user.');
			return null;
		}

		const {
			GOOGLE_OAUTH_CLIENT_ID,
			GOOGLE_OAUTH_CLIENT_SECRET,
			GOOGLE_OAUTH_REDIRECT_URL,
		} = process.env;

		if (
			!GOOGLE_OAUTH_CLIENT_ID ||
			!GOOGLE_OAUTH_CLIENT_SECRET ||
			!GOOGLE_OAUTH_REDIRECT_URL
		) {
			console.warn('Google OAuth environment variables are not configured.');
			return null;
		}

		const oAuthClient = new google.auth.OAuth2(
			GOOGLE_OAUTH_CLIENT_ID,
			GOOGLE_OAUTH_CLIENT_SECRET,
			GOOGLE_OAUTH_REDIRECT_URL
		);

		oAuthClient.setCredentials({ access_token: data[0].token });

		return oAuthClient;
	} catch (error) {
		console.warn('Failed to get OAuth client:', error);
		return null;
	}
}

export async function getCalendarEvents(
	clerkUserId: string,
	{ start, end }: TimeRange
) {
	try {
		const oAuthClient = await getOAuthClient(clerkUserId);

		if (!oAuthClient) {
			// OAuth not set up - return empty array (no conflicts to check)
			return [];
		}

		const events = await google.calendar('v3').events.list({
			calendarId: 'primary',
			eventTypes: ['default'],
			singleEvents: true,
			timeMin: start.toISOString(),
			timeMax: end.toISOString(),
			auth: oAuthClient,
		});

		return (
			events.data.items
				?.map(({ start, end }) => {
					if (!start || !end) return undefined;
					//handle all-day events
					if (start.date && end.date)
						return {
							start: startOfDay(new Date(start.date)),
							end: endOfDay(new Date(end.date)),
						};
					//handle timed events
					if (start.dateTime && end.dateTime)
						return {
							start: new Date(start.dateTime),
							end: new Date(end.dateTime),
						};
				})
				.filter((event): event is TimeRange => event !== undefined) || []
		);
	} catch (error) {
		console.error('Failed to get calendar events:', error);
		return [];
	}
}

type CreateGoogleCalendarEventProps = Omit<
	z.infer<typeof meetingActionSchema>,
	'eventId' | 'timezone'
> & {
	durationInMinutes: number;
	eventName: string;
};

export async function createGoogleCalendarEvent({
	clerkUserId,
	startTime,
	durationInMinutes,
	eventName,
	guestName,
	guestEmail,
	guestNotes,
}: CreateGoogleCalendarEventProps) {
	try {
		const oAuthClient = await getOAuthClient(clerkUserId);

		if (!oAuthClient) throw new Error('Failed to get OAuth client');

		const client = await clerkClient();
		const calendarUser = await client.users.getUser(clerkUserId);

		const usersPrimaryEmail = calendarUser.emailAddresses.find(
			({ id }) => id === calendarUser.primaryEmailAddressId
		);

		if (!usersPrimaryEmail) throw new Error('Clerk user has no primary email');

		const calendarEvent = await google.calendar('v3').events.insert({
			calendarId: 'primary',
			auth: oAuthClient,
			sendUpdates: 'all',
			requestBody: {
				attendees: [
					{ email: guestEmail, displayName: guestName },
					{
						email: usersPrimaryEmail.emailAddress,
						displayName: `${calendarUser.firstName} ${calendarUser.lastName}`,
						responseStatus: 'accepted',
					},
				],
				description: guestNotes
					? `Notes: ${guestNotes}`
					: 'No additional details provided.',
				start: {
					dateTime: startTime.toISOString(),
				},
				end: {
					dateTime: addMinutes(startTime, durationInMinutes).toISOString(),
				},
				summary: `${guestName} + ${calendarUser.firstName} ${calendarUser.lastName}: ${eventName}`,
			},
		});

		return calendarEvent.data;
	} catch (error) {
		console.error(`Error creating Google Calendar event: ${error}`);
		throw new Error(`Failed to create Google Calendar event: ${error}`);
	}
}
