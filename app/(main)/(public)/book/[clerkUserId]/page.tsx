import PublicProfile from '@/components/PublicProfile';
import { clerkClient } from '@clerk/nextjs/server';

export default async function BookingPage({
	params,
}: {
	params: Promise<{ clerkUserId: string }>;
}) {
	const { clerkUserId } = await params;
	const client = await clerkClient();
	const user = await client.users.getUser(clerkUserId);
	const userName =
		user.fullName ||
		`${user.firstName} ${user.lastName}` ||
		user.username ||
		'User';

	return <PublicProfile userId={clerkUserId} userName={userName} />;
}
