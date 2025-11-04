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
		<div className='container mx-auto max-w-2xl px-4 py-8'>
			<form onSubmit={onSubmit(handleFormSubmit)} className='space-y-6'>
				{errors.root && (
					<div className='rounded-lg border border-border bg-red-50 p-4 text-red-800'>
						{errors.root.message}
					</div>
				)}

				<div className='rounded-lg border border-border bg-white p-6 shadow-sm'>
					<h2 className='mb-6 text-xl font-semibold text-primary'>
						Event Details
					</h2>

					<div className='space-y-6'>
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-primary'
							>
								Event Name <span className='text-red-500'>*</span>
							</label>
							<input
								id='name'
								type='text'
								className='mt-1 block w-full rounded-md border border-border bg-white px-3 py-2 text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
								placeholder='e.g., 30-minute consultation'
								{...register('name')}
							/>
							{errors.name && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.name.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor='description'
								className='block text-sm font-medium text-primary'
							>
								Description
							</label>
							<textarea
								id='description'
								rows={4}
								className='mt-1 block w-full rounded-md border border-border bg-white px-3 py-2 text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
								placeholder='Optional description of the event'
								{...register('description')}
							/>
							{errors.description && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.description.message}
								</p>
							)}
						</div>

						<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
							<div>
								<label
									htmlFor='durationInMinutes'
									className='block text-sm font-medium text-primary'
								>
									Duration (minutes) <span className='text-red-500'>*</span>
								</label>
								<input
									id='durationInMinutes'
									type='number'
									className='mt-1 block w-full rounded-md border border-border bg-white px-3 py-2 text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
									placeholder='30'
									{...register('durationInMinutes', { valueAsNumber: true })}
								/>
								{errors.durationInMinutes && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.durationInMinutes.message}
									</p>
								)}
								<p className='mt-1 text-xs text-muted'>
									Must be a multiple of 15 minutes
								</p>
							</div>

							<div>
								<label
									htmlFor='isActive'
									className='block text-sm font-medium text-primary'
								>
									Status
								</label>
								<div className='mt-2 flex items-center'>
									<input
										id='isActive'
										type='checkbox'
										className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
										{...register('isActive')}
									/>
									<label
										htmlFor='isActive'
										className='ml-2 text-sm text-secondary'
									>
										Event is active
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='flex justify-end gap-4'>
					{event && (
						<button
							type='button'
							disabled={isDeletePending || isSubmitting}
							onClick={() => handleEventDelete(event.id)}
							className='btn-secondary rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50'
						>
							Delete
						</button>
					)}
					<button
						type='submit'
						disabled={isSubmitting}
						className='btn-primary rounded-lg px-6 py-2 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50'
					>
						{isSubmitting ? 'Saving...' : 'Save Event'}
					</button>
				</div>
			</form>
		</div>
	);
}
