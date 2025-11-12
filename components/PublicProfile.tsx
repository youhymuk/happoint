'use client';

import { useEffect, useState } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import EyeIcon from '@/components/icons/EyeIcon';
import { getPublicEvents } from '@/server/actions/events';
import { PublicEventType } from '@/types/events';
import { useUser } from '@clerk/nextjs';
import CopyButton from './CopyButton';
import PublicEventCard from './events/PublicEventCard';

type PublicProfileProps = {
	userId: string;
	userName: string;
};

export default function PublicProfile({
	userId,
	userName,
}: PublicProfileProps) {
	const [events, setEvents] = useState<PublicEventType[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const { user } = useUser();

	const isCurrentUser = user?.id === userId;
	const profileUrl = `${window.location.origin}/book/${userId}`;

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setIsLoading(true);

				const events = await getPublicEvents(userId);

				setEvents(events);
			} catch (error) {
				console.error(error); // TODO: Handle error
			} finally {
				setIsLoading(false);
			}
		};
		fetchEvents();
	}, [userId]);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className='max-w-5xl mx-auto p-5'>
			<h1>{userName}</h1>
			{isCurrentUser && (
				<>
					<div className='flex items-center gap-2'>
						<EyeIcon />
						<p>This is how users see your public profile</p>
					</div>
					<div className='flex items-center gap-2'>
						<CopyButton value={profileUrl} name='public profile URL' />
					</div>
				</>
			)}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<h2>Time to meet</h2>
				<p>Pick an event and let’s make it official by booking a time.</p>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{!events?.length ? (
					<p>No events found</p>
				) : (
					events.map((event) => (
						<PublicEventCard key={event.id} event={event} />
					))
				)}
			</div>
		</div>
	);
}
