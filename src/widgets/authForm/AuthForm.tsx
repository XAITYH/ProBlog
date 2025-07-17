'use client';

import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';
import {
	Box,
	Button,
	Center,
	Group,
	PasswordInput,
	Progress,
	Text,
	TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './authForm.module.css';

function PasswordRequirement({
	meets,
	label
}: {
	meets: boolean;
	label: string;
}) {
	return (
		<Text component='div' c={meets ? 'teal' : 'red'} mt={5} size='sm'>
			<Center inline>
				{meets ? (
					<IconCheck size={14} stroke={1.5} />
				) : (
					<IconX size={14} stroke={1.5} />
				)}
				<Box ml={7}>{label}</Box>
			</Center>
		</Text>
	);
}

const requirements = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
];

function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	requirements.forEach(requirement => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export function AuthForm({ type }: { type: 'login' | 'register' }) {
	const form = useForm({
		initialValues: {
			email: '',
			password: '',
			confirmPassword: ''
		},
		validate: {
			email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: value => {
				if (type === 'register') {
					if (value.length < 6)
						return 'Password must be at least 6 characters';
					const strength = getStrength(value);
					if (strength < 50) return 'Password is too weak';
					return null;
				} else {
					return null;
				}
			},
			confirmPassword: (value, values) =>
				value !== values.password ? 'Passwords do not match' : null
		},
		validateInputOnChange: true
	});

	const strength = getStrength(form.values.password);

	const checks = requirements.map((requirement, index) => (
		<PasswordRequirement
			key={index}
			label={requirement.label}
			meets={requirement.re.test(form.values.password)}
		/>
	));

	const bars = Array(4)
		.fill(0)
		.map((_, index) => (
			<Progress
				styles={{ section: { transitionDuration: '0ms' } }}
				value={
					form.values.password.length > 0 && index === 0
						? 100
						: strength >= ((index + 1) / 4) * 100
						? 100
						: 0
				}
				color={
					strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'
				}
				key={index}
				size={4}
			/>
		));

	return (
		<form onSubmit={form.onSubmit(console.log)} className={classes.form}>
			<TextInput
				size='md'
				mb={10}
				label='Email'
				placeholder='Your email'
				error={form.errors.email}
				withAsterisk
				rightSection={
					form.errors.email && (
						<IconAlertTriangle
							stroke={1.5}
							size={18}
							className={classes.icon}
						/>
					)
				}
				{...form.getInputProps('email')}
			/>

			<PasswordInput
				size='md'
				placeholder='Your password'
				label='Password'
				withAsterisk
				{...form.getInputProps('password')}
			/>

			{type === 'register' && (
				<>
					<Group gap={5} grow mt='xs' mb='md'>
						{bars}
					</Group>

					<PasswordRequirement
						label='Has at least 6 characters'
						meets={form.values.password.length > 5}
					/>
					{checks}
				</>
			)}

			{type === 'register' && (
				<PasswordInput
					size='md'
					mt='sm'
					label='Confirm password'
					placeholder='Confirm password'
					withAsterisk
					{...form.getInputProps('confirmPassword')}
				/>
			)}

			<Button type='submit' mt='sm' fullWidth>
				{type === 'login' ? 'Log in' : 'Sign up'}
			</Button>
		</form>
	);
}
