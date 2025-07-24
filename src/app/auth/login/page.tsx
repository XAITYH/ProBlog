'use client';

import { AuthForm } from '@/features/authForm/AuthForm';
import { UserType } from '@/shared/types/user.types';
import { notifications } from '@mantine/notifications';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
	const router = useRouter();

	const handleSubmit = async (userData: UserType) => {
		try {
			const result = await signIn('credentials', {
				email: userData.email,
				password: userData.password,
				redirect: false
			});

			if (result?.error) {
				throw new Error(result.error);
			} else {
				notifications.show({
					title: 'Login successful',
					message: 'Welcome!',
					color: 'green',
					autoClose: 2500
				});

				router.push('/');
			}
		} catch (error) {
			notifications.show({
				title: 'Login failed',
				message: 'An error occured',
				color: 'red',
				autoClose: 2500
			});
		}
	};

	return (
		<div>
			<AuthForm
				type='login'
				onSubmit={(userData: UserType) => handleSubmit(userData)}
			/>
		</div>
	);
};

export default Login;
