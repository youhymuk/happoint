import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
	return (
		<>
			<header>Happoint</header>
			<main>
				<h1 className='text-2xl font-semibold'>Login</h1>
				<p>
					Welcome back! Please log in to your account to manage your
					appointments
				</p>
				<div>
					<SignIn />
				</div>
			</main>
		</>
	);
}
