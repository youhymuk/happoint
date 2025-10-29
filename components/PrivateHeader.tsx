'use client';

import { PrivateRoutesConfig } from '@/constants';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PrivateHeader() {
	const pathname = usePathname();

	return (
		<header>
			<nav className='flex justify-between'>
				<Link href='/'>
					<Image
						src='/assets/logo.png'
						alt='Happoint logo'
						width={100}
						height={100}
					/>
				</Link>
				<ul className='flex gap-4'>
					{PrivateRoutesConfig.map(({ label, route }) => {
						const isActive =
							pathname === route || pathname.startsWith(`${route}/`); // will use later for dynamic Classnames

						return (
							<li key={route}>
								<Link href={route}>{label}</Link>
							</li>
						);
					})}
				</ul>
				<UserButton />
			</nav>
		</header>
	);
}
