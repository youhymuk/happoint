import ScheduleForm from '@/components/forms/ScheduleForm';
import { getSchedule } from '@/server/actions/schedule';
import { requireAuthWithRedirect } from '@/server/utils';

export default async function SchedulePage() {
	const { userId } = await requireAuthWithRedirect();

	const schedule = await getSchedule(userId);

	return (
		<article className='container mx-auto px-4 py-8'>
			<h1 className='mb-2 text-center text-3xl font-bold text-primary'>
				Schedule
			</h1>
			<ScheduleForm schedule={schedule} />
		</article>
	);
}
