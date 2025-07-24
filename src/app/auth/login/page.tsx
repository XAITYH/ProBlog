'use client';

import { AuthForm } from '@/features/authForm/AuthForm';
import { useStore } from '@/lib/store';
import { UserType } from '@/shared/types/user.types';
import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const Login = () => {
	const router = useRouter();

	const searchParams = useSearchParams();
	const registered = searchParams.get('registered');

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
			{registered && (
				<Text c='green' className='text-center' mb='md'>
					Registration successful! Please login.
				</Text>
			)}

			<AuthForm
				type='login'
				onSubmit={(userData: UserType) => handleSubmit(userData)}
			/>
		</div>
	);
};

export default Login;
