import PrivateHeader from '@/components/PrivateHeader';
import PublicHeader from '@/components/PublicHeader';
import { currentUser } from '@clerk/nextjs/server';

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await currentUser();

	return (
		<>
			{user ? <PrivateHeader /> : <PublicHeader />}
			<main>{children}</main>
		</>
	);
}
