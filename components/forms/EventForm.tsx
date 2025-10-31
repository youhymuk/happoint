'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { eventFormSchema } from '@/schema/event';
import { createEvent, deleteEvent, updateEvent } from '@/server/actions/events';

type EventFormProps = {
	event?: {
		id: string;
		name: string;
		isActive: boolean;
		durationInMinutes: number;
		description?: string;
	};
};

export type EventFormDataType = z.infer<typeof eventFormSchema>;

const defaultValues = {
	name: '',
	description: '',
	durationInMinutes: 30,
	isActive: true,
};

export default function EventForm({ event }: EventFormProps) {
	const [isDeletePending, startDeleteTransition] = useTransition();

	const router = useRouter();

	const {
		handleSubmit: onSubmit,
		register,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<EventFormDataType>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: event || defaultValues,
	});

	async function handleFormSubmit(data: EventFormDataType) {
		try {
			if (event) {
				await updateEvent(event.id, data);
			} else {
				await createEvent(data);
			}
		} catch (error: unknown) {
			setError('root', {
				message:
					error instanceof Error
						? error.message
						: 'An unexpected error occurred',
			});
		}
	}

	function handleEventDelete(eventId: string) {
		startDeleteTransition(async () => {
			try {
				await deleteEvent(eventId);
				router.push('/events');
			} catch (error: unknown) {
				setError('root', {
					message:
						error instanceof Error
							? error.message
							: 'An unexpected error occurred',
				});
			}
		});
	}

	return (
		<form onSubmit={onSubmit(handleFormSubmit)}>
			{errors.root && (
				<div style={{ color: 'red', marginBottom: '1rem' }}>
					{errors.root.message}
				</div>
			)}
			<div>
				<label htmlFor='name'>Name</label>
				<input id='name' type='text' {...register('name')} />
				{errors.name && <p>{errors.name.message}</p>}
				<label htmlFor='description'>Description</label>
				<textarea
					id='description'
					rows={4}
					placeholder='Optional description of the event'
					{...register('description')}
				/>
				{errors.description && <p>{errors.description.message}</p>}
				<label htmlFor='durationInMinutes'>Duration</label>
				<input
					id='durationInMinutes'
					type='number'
					placeholder='Duration in minutes'
					{...register('durationInMinutes')}
				/>
				{errors.durationInMinutes && <p>{errors.durationInMinutes.message}</p>}
			</div>
			<div>
				{event && (
					<button
						type='button'
						disabled={isDeletePending || isSubmitting}
						onClick={() => handleEventDelete(event.id)}
					>
						Delete
					</button>
				)}
				<button type='submit'>Save</button>
			</div>
		</form>
	);
}
