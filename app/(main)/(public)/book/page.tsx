import { requireAuthWithRedirect } from '@/server/utils';
import { redirect } from 'next/navigation';

export default async function PublicBookPage() {
	const { userId } = await requireAuthWithRedirect();

	return redirect(`/book/${userId}`);
}
