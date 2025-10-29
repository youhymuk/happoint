import { SignInButton, SignUpButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function PublicHeader({}) {
	return (
		<header>
			<nav>
				<Link href='/login'>
					<Image
						src='/assets/logo.png'
						alt='Happoint logo'
						width={100}
						height={100}
					/>
				</Link>
				<ul>
					<li>
						<SignInButton>
							<button>Login</button>
						</SignInButton>
					</li>
					<li>
						<SignUpButton>
							<button>Register</button>
						</SignUpButton>
					</li>
				</ul>
			</nav>
		</header>
	);
}
