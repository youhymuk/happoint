import Test from '@/components/Test';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
	const user = await currentUser();

	if (!user) return <Test />;

	return redirect('/events');
}
