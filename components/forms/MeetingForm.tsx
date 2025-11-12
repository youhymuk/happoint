'use client';

import { formatTimezoneOffset } from '@/lib/formatters';
import { meetingFormSchema } from '@/schema/meeting';
import { createMeeting } from '@/server/actions/meetings';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isSameDay, setHours, setMinutes, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

type MeetingFormProps = {
	validSlots: Date[];
	eventId: string;
	clerkUserId: string;
};

export type MeetingFormDataType = z.infer<typeof meetingFormSchema>;

const defaultValues = {
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
	guestName: '',
	guestEmail: '',
	guestNotes: '',
};

type TimezoneOption = {
	value: string;
	label: string;
};

export default function MeetingForm({
	validSlots,
	eventId,
	clerkUserId,
}: MeetingFormProps) {
	const router = useRouter();
	const [selectedTime, setSelectedTime] = useState<string>('');
	const [timezoneOptions, setTimezoneOptions] = useState<TimezoneOption[]>([]);
	const {
		formState: { isSubmitting, errors },
		handleSubmit: onSubmit,
		register,
		setError,
		setValue,
		control,
	} = useForm<MeetingFormDataType>({
		resolver: zodResolver(meetingFormSchema),
		defaultValues,
	});

	// Load timezones on client side only to avoid hydration mismatch
	useEffect(() => {
		const timezones = Intl.supportedValuesOf('timeZone')
			.map((tz) => ({
				value: tz,
				label: `${tz} (${formatTimezoneOffset(tz) || ''})`,
			}))
			.sort((a, b) => a.value.localeCompare(b.value));
		startTransition(() => {
			setTimezoneOptions(timezones);
		});
	}, []);

	const timezone = useWatch({ control, name: 'timezone' });
	const date = useWatch({ control, name: 'date' });

	const validSlotsForTimezone = useMemo(
		() => validSlots.map((date) => toZonedTime(date, timezone)),
		[validSlots, timezone]
	);

	const availableTimesForDate = useMemo(() => {
		if (!date) return [];
		return validSlotsForTimezone
			.filter((slot) => isSameDay(slot, date))
			.map((slot) => format(slot, 'HH:mm'))
			.sort();
	}, [date, validSlotsForTimezone]);

	useEffect(() => {
		startTransition(() => {
			if (!date) {
				setSelectedTime('');
				setValue(
					'startTime',
					undefined as unknown as MeetingFormDataType['startTime'],
					{
						shouldValidate: false,
						shouldDirty: true,
					}
				);
				return;
			}

			const startOfSelectedDay = startOfDay(date);
			setSelectedTime('');
			setValue('startTime', startOfSelectedDay, {
				shouldValidate: false,
				shouldDirty: true,
			});
		});
	}, [date, setValue]);

	function handleTimeChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const time = e.target.value;
		setSelectedTime(time);
		if (date && time) {
			const [hours, minutes] = time.split(':').map(Number);
			const startTime = setMinutes(setHours(date, hours), minutes);
			setValue('startTime', startTime, { shouldValidate: true });
		}
	}

	function handleCancel() {
		router.back();
	}

	async function handleFormSubmit(data: MeetingFormDataType) {
		try {
			const { date, ...meetingData } = data;
			const meeting = await createMeeting({
				...meetingData,
				eventId,
				clerkUserId,
			});

			const path = `/book/${meeting.clerkUserId}/${
				meeting.eventId
			}/success?startTime=${meeting.startTime.toISOString()}`;
			router.push(path);
		} catch (error) {
			console.error(error);
			setError('root', {
				message: 'Failed to book meeting',
			});
		}
	}

	return (
		<div className='container mx-auto max-w-2xl px-4 py-8'>
			<form onSubmit={onSubmit(handleFormSubmit)} className='space-y-6'>
				{errors.root && (
					<div className='rounded-lg border border-red-500 bg-red-50 p-4 text-red-800'>
						{errors.root.message}
					</div>
				)}

				{/* Timezone Selection */}
				<div>
					<label
						htmlFor='timezone'
						className='block mb-2 text-sm font-medium text-gray-700'
					>
						Timezone
					</label>
					<select
						id='timezone'
						{...register('timezone')}
						className={`block w-full rounded border border-gray-300 p-2 text-sm ${
							errors.timezone ? 'border-red-500' : ''
						}`}
					>
						{!timezoneOptions.length ? (
							<option value={defaultValues.timezone}>
								{defaultValues.timezone}
							</option>
						) : (
							timezoneOptions.map((tz) => (
								<option key={tz.value} value={tz.value}>
									{tz.label}
								</option>
							))
						)}
					</select>
					{errors.timezone && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.timezone.message as string}
						</p>
					)}
				</div>

				{/* Date Picker */}
				<div>
					<label
						htmlFor='date'
						className='block mb-2 text-sm font-medium text-gray-700'
					>
						Date
					</label>
					<input
						type='date'
						id='date'
						min={format(new Date(), 'yyyy-MM-dd')}
						{...register('date', {
							valueAsDate: true,
						})}
						className={`block w-full rounded border border-gray-300 p-2 text-sm ${
							errors.date ? 'border-red-500' : ''
						}`}
					/>
					{errors.date && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.date.message as string}
						</p>
					)}
				</div>

				{/* Time Selection */}
				{date && (
					<div>
						<label
							htmlFor='time'
							className='block mb-2 text-sm font-medium text-gray-700'
						>
							Time
						</label>
						<select
							id='time'
							value={selectedTime}
							onChange={handleTimeChange}
							className={`block w-full rounded border border-gray-300 p-2 text-sm ${
								errors.startTime ? 'border-red-500' : ''
							}`}
						>
							<option value=''>Select a time</option>
							{availableTimesForDate.map((time) => (
								<option key={time} value={time}>
									{time}
								</option>
							))}
						</select>
						{errors.startTime && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.startTime.message as string}
							</p>
						)}
						{availableTimesForDate.length === 0 && date && (
							<p className='mt-1 text-sm text-gray-500'>
								No available time slots for this date
							</p>
						)}
					</div>
				)}

				{/* Guest Name */}
				<div>
					<label
						htmlFor='guestName'
						className='block mb-2 text-sm font-medium text-gray-700'
					>
						Your Name
					</label>
					<input
						type='text'
						id='guestName'
						{...register('guestName')}
						className={`block w-full rounded border border-gray-300 p-2 text-sm ${
							errors.guestName ? 'border-red-500' : ''
						}`}
						placeholder='Enter your name'
					/>
					{errors.guestName && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.guestName.message as string}
						</p>
					)}
				</div>

				{/* Guest Email */}
				<div>
					<label
						htmlFor='guestEmail'
						className='block mb-2 text-sm font-medium text-gray-700'
					>
						Your Email
					</label>
					<input
						type='email'
						id='guestEmail'
						{...register('guestEmail')}
						className={`block w-full rounded border border-gray-300 p-2 text-sm ${
							errors.guestEmail ? 'border-red-500' : ''
						}`}
						placeholder='Enter your email'
					/>
					{errors.guestEmail && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.guestEmail.message as string}
						</p>
					)}
				</div>

				{/* Guest Notes */}
				<div>
					<label
						htmlFor='guestNotes'
						className='block mb-2 text-sm font-medium text-gray-700'
					>
						Notes (Optional)
					</label>
					<textarea
						id='guestNotes'
						{...register('guestNotes')}
						rows={4}
						className={`block w-full rounded border border-gray-300 p-2 text-sm ${
							errors.guestNotes ? 'border-red-500' : ''
						}`}
						placeholder='Add any additional notes or requirements...'
					/>
					{errors.guestNotes && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.guestNotes.message as string}
						</p>
					)}
				</div>

				{/* Buttons */}
				<div className='flex gap-4 justify-end'>
					<button
						type='button'
						onClick={handleCancel}
						className='px-6 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
					>
						Cancel
					</button>
					<button
						type='submit'
						disabled={isSubmitting}
						className='btn-primary px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isSubmitting ? 'Booking...' : 'Book Meeting'}
					</button>
				</div>
			</form>
		</div>
	);
}
