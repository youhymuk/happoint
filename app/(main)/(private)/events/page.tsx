import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

import { getEvents } from '@/server/actions/events';

export default async function EventsPage() {
	const { userId, redirectToSignIn } = await auth();

	if (!userId) return redirectToSignIn();

	const events = await getEvents(userId);

	return (
		<section>
			<h1>Events</h1>
			<Link href='/events/new'>Create new event</Link>
			{!!events.length ? (
				<ul>
					{events.map(({ id, name }) => (
						<li key={id}>{name}</li>
					))}
				</ul>
			) : (
				<p>You don&apos;t have any events yet</p>
			)}
		</section>
	);
}
