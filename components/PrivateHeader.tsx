'use client';

import { PrivateRoutesConfig } from '@/constants';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Logo from './Logo';

export default function PrivateHeader() {
	return (
		<header className='sticky top-0 z-50 border-b border-border bg-header-bg shadow-sm'>
			<nav className='container mx-auto flex items-center justify-between px-4 py-3'>
				<Logo />
				<ul className='flex items-center gap-1'>
					{PrivateRoutesConfig.map(({ label, route }) => (
						<li key={route}>
							<Link
								href={route}
								className='flex items-center gap-1 px-4 py-2 text-md font-medium text-nav transition-opacity hover:opacity-70'
							>
								{label}
							</Link>
						</li>
					))}
				</ul>
				<div className='flex items-center'>
					<UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
				</div>
			</nav>
		</header>
	);
}
