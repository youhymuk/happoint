import { SignIn } from '@clerk/nextjs';

import Logo from '@/components/Logo';

export default function LoginPage() {
	return (
		<main className='flex min-h-screen items-center justify-center bg-background px-4 py-12'>
			<div className='w-full max-w-md space-y-8 rounded-lg border border-border bg-white p-8 shadow-sm'>
				<div className='flex flex-col items-center gap-6'>
					<Logo />
					<SignIn />
				</div>
			</div>
		</main>
	);
}
