import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
	return (
		<>
			<header>Happoint</header>
			<main>
				<h1 className='text-2xl font-semibold'>Login</h1>
				<p>Create an account to start managing your appointments</p>
				<div>
					<SignUp />
				</div>
			</main>
		</>
	);
}
