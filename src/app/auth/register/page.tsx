'use client';

import Loader from '@/components/loader/Loader';
import { AuthForm } from '@/features/authForm/AuthForm';
import { UserType } from '@/shared/types/user.types';
import { notifications } from '@mantine/notifications';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Register = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (userData: UserType) => {
		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Registration failed');
			}

			notifications.show({
				title: 'Success!',
				message: 'Account created successfully',
				color: 'green',
				autoClose: 2500
			});

			const signInRes = await signIn('credentials', {
				email: userData.email,
				password: userData.password,
				redirect: false
			});

			if (signInRes?.error) {
				throw new Error(signInRes.error);
			} else {
				router.push('/profile');
			}
		} catch (error) {
			notifications.show({
				title: 'Registration failed',
				message: 'An error occured',
				color: 'red',
				autoClose: 2500
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<AuthForm
						type='register'
						onSubmit={(userData: UserType) =>
							handleSubmit(userData)
						}
					/>
				</div>
			)}
		</>
	);
};

export default Register;
