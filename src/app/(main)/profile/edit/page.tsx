'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Paper, TextInput, Button, Group, Modal, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Cropper from 'react-easy-crop';
import classes from './page.module.css';
import { getSession } from 'next-auth/react';

const ProfileEdit = () => {
	const currentUser = useStore(state => state.currentUser);
	const updateUser = useStore(state => state.updateUser);
	const router = useRouter();

	const [name, setName] = useState(currentUser?.name || '');
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(
		currentUser?.image || null
	);
	const [imageUrl, setImageUrl] = useState<string | null>(
		currentUser?.image || null
	);
	const [cropModalOpen, setCropModalOpen] = useState(false);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [originalFileType, setOriginalFileType] =
		useState<string>('image/jpeg');
	const [originalFileExt, setOriginalFileExt] = useState<string>('jpg');
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setName(currentUser?.name || '');
		setCroppedImage(currentUser?.image || null);
		setImageUrl(currentUser?.image || null);
	}, [currentUser]);

	// Clean up blob URLs
	useEffect(() => {
		return () => {
			if (croppedImage && croppedImage !== currentUser?.image) {
				URL.revokeObjectURL(croppedImage);
			}
		};
	}, [croppedImage, currentUser?.image]);

	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setOriginalFileType(file.type);
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
			const data = await response.json();
			const url = data.url;

			if (croppedImage && croppedImage !== currentUser?.image) {
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
			console.error(error);
			notifications.show({
				title: 'Error',
				message: 'Failed to save image',
				color: 'red'
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await updateUser({
				name,
				image: imageUrl
			});

			const res = await fetch('/api/auth/refresh-session', {
				method: 'POST'
			});
			const data = await res.json();

			if (data.user) {
				useStore.setState({ currentUser: data.user });
			}

			await getSession();

			notifications.show({
				title: 'Profile updated',
				message: 'Your profile has been updated successfully.',
				color: 'green'
			});
			router.push('/profile');
		} catch (error) {
			notifications.show({
				title: 'Error',
				message: 'Failed to update profile',
				color: 'red'
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Paper
			radius='md'
			p='lg'
			withBorder
			style={{ maxWidth: 400, margin: '40px auto' }}
		>
			<form onSubmit={handleSubmit}>
				<Text size='xl' fw={700} mb='md'>
					Edit Profile
				</Text>
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
								src={croppedImage}
								alt='Profile'
								className={classes.profileImage}
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
						<Button onClick={handleCropSave} loading={isLoading}>
							Save
						</Button>
					</Group>
				</Modal>
				<TextInput
					size='md'
					mb={10}
					label='Name'
					placeholder='Your name'
					value={name}
					onChange={e => setName(e.currentTarget.value)}
					withAsterisk
				/>
				<Button type='submit' mt='md' fullWidth loading={isLoading}>
					Save Changes
				</Button>
				<Button
					mt='sm'
					fullWidth
					variant='outline'
					color='gray'
					onClick={() => router.push('/profile')}
				>
					Cancel
				</Button>
			</form>
		</Paper>
	);
};

export default ProfileEdit;
