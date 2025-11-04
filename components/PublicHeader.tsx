import { SignInButton, SignUpButton } from '@clerk/nextjs';
import Logo from './Logo';

export default function PublicHeader({}) {
	return (
		<header className='sticky top-0 z-50 border-b border-border bg-header-bg shadow-sm'>
			<nav className='container mx-auto flex items-center justify-between px-4 py-4'>
				<Logo />
				<ul className='flex items-center gap-4'>
					<li>
						<SignInButton>
							<button className='btn-accent px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90'>
								Login
							</button>
						</SignInButton>
					</li>
					<li>
						<SignUpButton>
							<button className='btn-accent px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90'>
								Register
							</button>
						</SignUpButton>
					</li>
				</ul>
			</nav>
		</header>
	);
}
