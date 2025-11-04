import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function LoginPage() {
	return (
		<main className='flex min-h-screen items-center justify-center bg-background px-4 py-12'>
			<div className='w-full max-w-md space-y-8 rounded-lg border border-border bg-white p-8 shadow-sm'>
				<div className='text-center'>
					<Link href='/' className='mb-6 inline-block'>
						<h1 className='text-2xl font-bold text-primary'>Happoint</h1>
					</Link>
					<h2 className='text-2xl font-semibold text-primary'>Welcome back</h2>
					<p className='mt-2 text-sm text-secondary'>
						Sign in to your account to manage your appointments
					</p>
				</div>
				<div className='flex justify-center'>
					<SignIn />
				</div>
			</div>
		</main>
	);
}
