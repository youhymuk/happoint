'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function LandingPage() {
	return (
		<main className='min-h-screen bg-background'>
			{/* Hero Section */}
			<section className='container mx-auto px-4 py-20'>
				<div className='mx-auto max-w-4xl text-center'>
					<h1 className='mb-6 text-5xl font-bold tracking-tight text-primary sm:text-6xl'>
						Manage Your Schedule
						<br />
						<span className='text-primary'>Effortlessly</span>
					</h1>
					<p className='mx-auto mb-8 max-w-2xl text-xl text-secondary'>
						Join thousands of professionals who easily book meetings and manage
						their schedules with Happoint. Streamline your appointment booking
						process.
					</p>
					<div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
						<SignUpButton>
							<button className='btn-accent px-8 py-3 text-base font-semibold shadow-lg transition-opacity hover:opacity-90 hover:shadow-xl'>
								Get Started Free
							</button>
						</SignUpButton>
						<SignInButton>
							<button className='btn-accent px-8 py-3 text-base font-semibold transition-opacity hover:opacity-90'>
								Sign In
							</button>
						</SignInButton>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='container mx-auto px-4 py-16'>
				<div className='grid gap-8 md:grid-cols-3'>
					<div className='rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md'>
						<div className='mb-4 text-3xl'>📅</div>
						<h3 className='mb-2 text-xl font-semibold text-primary'>
							Easy Scheduling
						</h3>
						<p className='text-secondary'>
							Create and manage events with just a few clicks. Set your
							availability and let clients book at their convenience.
						</p>
					</div>
					<div className='rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md'>
						<div className='mb-4 text-3xl'>⚡</div>
						<h3 className='mb-2 text-xl font-semibold text-primary'>
							Instant Booking
						</h3>
						<p className='text-secondary'>
							Share your public profile link and allow clients to book
							appointments instantly without back-and-forth emails.
						</p>
					</div>
					<div className='rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md'>
						<div className='mb-4 text-3xl'>📊</div>
						<h3 className='mb-2 text-xl font-semibold text-primary'>
							Stay Organized
						</h3>
						<p className='text-secondary'>
							Keep track of all your events and schedules in one centralized
							dashboard. Never miss an appointment again.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
