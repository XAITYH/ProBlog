'use client';

import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';
import {
	Box,
	Button,
	Center,
	Divider,
	Group,
	Modal,
	Paper,
	PasswordInput,
	Progress,
	Text,
	TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './authForm.module.css';
import { GoogleButton } from './ui/GoogleButton';
import { AuthFormType } from '@/shared/types/authForm.types';
import { signIn } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { notifications } from '@mantine/notifications';

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

// Password requirements
const requirements = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
];

// Check how strong password is
function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	requirements.forEach(requirement => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

type FormType = {
	name?: string;
	email: string;
	password: string;
	confirmPassword?: string;
};

export function AuthForm({ type, onSubmit }: AuthFormType) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [cropModalOpen, setCropModalOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [originalFileType, setOriginalFileType] =
		useState<string>('image/jpeg');
	const [originalFileExt, setOriginalFileExt] = useState<string>('jpg');
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormType>({
		mode: 'controlled',
		initialValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		},
		validate: {
			email: value =>
				/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email',
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

	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setOriginalFileType(file.type); // e.g., "image/png" or "image/jpeg"
			setOriginalFileExt(file.type === 'image/png' ? 'png' : 'jpg');
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImageSrc(reader.result as string);
				setCropModalOpen(true);
			});
			reader.readAsDataURL(file);
		}
	};

	const onCropComplete = useCallback(
		(
			_: unknown,
			croppedAreaPixels: {
				x: number;
				y: number;
				width: number;
				height: number;
			}
		) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[]
	);

	const getCroppedImg = async (
		imageSrc: string,
		crop: { x: number; y: number; width: number; height: number },
		type: string
	) => {
		const image = new window.Image();
		image.src = imageSrc;
		await new Promise(resolve => (image.onload = resolve));
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = crop.width;
		canvas.height = crop.height;
		ctx?.drawImage(
			image,
			crop.x,
			crop.y,
			crop.width,
			crop.height,
			0,
			0,
			crop.width,
			crop.height
		);
		return new Promise<Blob>((resolve, reject) => {
			canvas.toBlob(blob => {
				if (blob) resolve(blob);
				else reject(new Error('Canvas is empty'));
			}, type);
		});
	};

	const handleCropSave = async () => {
		setIsLoading(true);
		try {
			if (!imageSrc || !croppedAreaPixels) return;
			const croppedBlob = await getCroppedImg(
				imageSrc,
				croppedAreaPixels,
				originalFileType
			);
			const newCroppedImage = URL.createObjectURL(croppedBlob);
			const file = new File([croppedBlob], `profile.${originalFileExt}`, {
				type: originalFileType
			});

			const formData = new FormData();
			formData.append('file', file);
			formData.append(
				'path',
				`profile-images/${Date.now()}-profile.${originalFileExt}`
			);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Upload failed');
			}

			const data = await response.json();
			const url = data.url;

			if (croppedImage) {
				URL.revokeObjectURL(croppedImage);
			}

			setCroppedImage(newCroppedImage);
			setImageUrl(url);
			setCropModalOpen(false);

			notifications.show({
				title: 'Success',
				message: 'Image saved successfully',
				color: 'green'
			});
		} catch (error) {
			console.error('Upload error:', error);

			notifications.show({
				title: 'Error',
				message:
					error instanceof Error
						? error.message
						: 'Failed to save image',
				color: 'red'
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (croppedImage) {
				URL.revokeObjectURL(croppedImage);
			}
		};
	}, [croppedImage]);

	return (
		<Paper radius='md' p='lg' withBorder className={classes.form_container}>
			<Text size='lg' fw={500}>
				Welcome to <strong>ProBlog</strong>, login with
			</Text>
			<Group grow mb='md' mt='md'>
				<GoogleButton
					radius='xl'
					onClick={() => signIn('google', { callbackUrl: '/' })}
				>
					Google
				</GoogleButton>
			</Group>

			<Divider
				label='Or continue with email'
				labelPosition='center'
				my='lg'
			/>
			<form
				onSubmit={e => {
					e.preventDefault();
					onSubmit({
						email: form.values.email,
						password: form.values.password,
						...(type === 'register' && {
							name: form.values.name,
							image: imageUrl ?? null
						})
					});
				}}
				className={classes.form}
			>
				{type === 'register' && (
					<>
						<Group mb='md'>
							<input
								type='file'
								accept='image/*'
								ref={inputRef}
								onChange={onSelectFile}
								style={{ display: 'none' }}
							/>
							<Button
								variant='outline'
								onClick={() => inputRef.current?.click()}
								style={{ marginRight: 16 }}
							>
								Choose Profile Image
							</Button>
							{croppedImage && (
								<>
									<img
										className={classes.profileImagePreview}
										src={croppedImage}
										alt='Profile'
									/>
									<Button
										variant='subtle'
										color='red'
										size='xs'
										onClick={() => {
											setCroppedImage(null);
											setImageUrl(null);
											if (inputRef.current)
												inputRef.current.value = '';
										}}
									>
										Remove
									</Button>
								</>
							)}
						</Group>
						<Modal
							opened={cropModalOpen}
							onClose={() => setCropModalOpen(false)}
							title='Crop your profile image'
							centered
							size='lg'
						>
							{imageSrc && (
								<div
									style={{
										position: 'relative',
										width: '100%',
										height: 300
									}}
								>
									<Cropper
										image={imageSrc}
										crop={crop}
										zoom={zoom}
										aspect={1}
										onCropChange={setCrop}
										onCropComplete={onCropComplete}
										onZoomChange={setZoom}
										cropShape='round'
									/>
								</div>
							)}
							<Group mt='md' className='right-0'>
								<Button
									onClick={handleCropSave}
									loading={isLoading}
								>
									Save
								</Button>
							</Group>
						</Modal>

						<TextInput
							size='md'
							mb={10}
							label='Name'
							placeholder='Your name'
							error={form.errors.name}
							withAsterisk
							rightSection={
								form.errors.name && (
									<IconAlertTriangle
										stroke={1.5}
										size={18}
										className={classes.icon}
									/>
								)
							}
							key={form.key('name')}
							{...form.getInputProps('name')}
						/>
					</>
				)}

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
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>

				<PasswordInput
					size='md'
					placeholder='Your password'
					label='Password'
					withAsterisk
					key={form.key('password')}
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
						key={form.key('confirmPassword')}
						{...form.getInputProps('confirmPassword')}
					/>
				)}

				<Button type='submit' mt='md' fullWidth size='md'>
					{type === 'login' ? 'Log in' : 'Sign up'}
				</Button>
			</form>
		</Paper>
	);
}
