'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import PlusIcon from '@/components/icons/PlusIcon';
import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';
import { formatTimezoneOffset, timeToDecimal } from '@/lib/formatters';
import { scheduleFormSchema } from '@/schema/schedule';
import { saveSchedule } from '@/server/actions/schedule';
import type { Schedule } from '@/types/schedule';
import XMarkIcon from '../icons/XMarkIcon';

type ScheduleFormProps = {
	schedule: Schedule | undefined;
};

export type ScheduleFormDataType = z.infer<typeof scheduleFormSchema>;

const defaultValues = {
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
	availabilities: [],
};

export default function ScheduleForm({ schedule }: ScheduleFormProps) {
	console.log(schedule);
	const {
		register,
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<ScheduleFormDataType>({
		resolver: zodResolver(scheduleFormSchema),
		defaultValues: schedule
			? {
					...schedule,
					availabilities: schedule.availabilities.toSorted(
						(a, b) => timeToDecimal(a.startTime) - timeToDecimal(b.startTime)
					),
			  }
			: defaultValues,
	});

	const {
		fields: availabilityFields,
		append: addAvailability,
		remove: removeAvailability,
	} = useFieldArray({ name: 'availabilities', control });

	const groupedAvailabilityFields = Object.groupBy(
		availabilityFields.map((field, index) => ({ ...field, id: index })),
		(field) => field.dayOfWeek
	);

	function handleAddAvailability(
		dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
	) {
		addAvailability({
			dayOfWeek,
			startTime: '09:00',
			endTime: '17:00',
		});
	}

	async function handleFormSubmit(data: ScheduleFormDataType) {
		try {
			await saveSchedule(data);
			//TODO:add success message
		} catch (error: unknown) {
			setError('root', {
				message:
					error instanceof Error
						? error.message
						: 'An unexpected error occurred',
			});
		}
	}

	return (
		<div className='container mx-auto max-w-2xl px-4 py-8'>
			<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
				{errors.root && (
					<div className='rounded-lg border border-border bg-red-50 p-4 text-red-800'>
						{errors.root.message}
					</div>
				)}
				<div className='mb-6 '>
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
						{Intl.supportedValuesOf('timeZone').map((tz: string) => (
							<option key={tz} value={tz}>
								{tz} ({formatTimezoneOffset(tz)})
							</option>
						))}
					</select>
					{errors.timezone && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.timezone.message as string}
						</p>
					)}
					{DAYS_OF_WEEK_IN_ORDER.map((day) => (
						<div key={day} className='flex mb-4 gap-4 items-center'>
							<label className='block text-sm font-medium text-gray-700 capitalize mb-2'>
								{day}
							</label>
							<div>
								<button
									type='button'
									onClick={() => handleAddAvailability(day)}
								>
									<PlusIcon />
								</button>
								{groupedAvailabilityFields[day]?.map((field) => (
									<div key={field.id}>
										<input
											type='time'
											{...register(`availabilities.${field.id}.startTime`)}
										/>
										<input
											type='time'
											{...register(`availabilities.${field.id}.endTime`)}
										/>
										<button
											type='button'
											onClick={() => removeAvailability(field.id)}
										>
											<XMarkIcon />
										</button>
										{errors.availabilities?.[field.id]?.message && (
											<p className='text-red-500'>
												{errors.availabilities[field.id]?.message}
											</p>
										)}
									</div>
								))}
							</div>
						</div>
					))}
					<button
						disabled={isSubmitting || !isDirty}
						type='submit'
						className='btn-primary'
					>
						Save
					</button>
				</div>
			</form>
		</div>
	);
}
