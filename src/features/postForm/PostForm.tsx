'use client';

import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import classes from './postForm.module.css';

import {
	IconAlertCircle,
	IconCloudUpload,
	IconDownload,
	IconX
} from '@tabler/icons-react';

import {
	Alert,
	Button,
	Group,
	Select,
	Text,
	Textarea,
	TextInput,
	useMantineTheme
} from '@mantine/core';

import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { PostType } from '@/shared/types/post.types';

import { useStore } from '@/lib/store';

import { MAX_TITLE_LENGTH } from '@/shared/constants/maxTitleLength';
import { MAX_DESCRIPTION_LENGTH } from '@/shared/constants/maxDescriptionLength';

import { TopicVars } from '@/shared/constants/topics.constants';

import Image from 'next/image';
import { redirect, useSearchParams } from 'next/navigation';
import { TopicTypes } from '@/shared/types/topics.types';

type PostFormType = {
	post?: PostType;
};

const PostForm = ({ post }: PostFormType) => {
	const [files, setFiles] = useState<File[]>([]);
	const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

	const initialPreviews = post?.files?.map(f => f.url) || [];
	const [previews, setPreviews] = useState<string[]>(initialPreviews);
	const [existingFiles, setExistingFiles] = useState<string[]>(
		post?.files?.map(f => f.url) || []
	);
	const [isUploading, setIsUploading] = useState(false);

	const [showTitleWarning, setShowTitleWarning] = useState(false);
	const [showDescriptionWarning, setShowDescriptionWarning] = useState(false);

	const [showSuccess, setShowSuccess] = useState(false);

	const searchParams = useSearchParams();
	const topicFromUrl = (searchParams.get('topic') as TopicTypes) || 'all';

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			images: initialPreviews,
			title: post?.title || '',
			description: post?.description || '',
			topic: post?.topic || topicFromUrl
		},

		validate: {
			images: files => (files.length > 5 ? 'Too many files' : null),
			title: value => (value === '' ? 'Title is empty' : null),
			description: value => (value === '' ? 'Description is empty' : null)
		},

		onValuesChange: values => {
			form.validate();

			setShowTitleWarning(values.title.length === MAX_TITLE_LENGTH);
			setShowDescriptionWarning(
				values.description.length === MAX_DESCRIPTION_LENGTH
			);
		}
	});

	const theme = useMantineTheme();
	const openRef = useRef<() => void>(null);

	const titleSymbolsLeft = MAX_TITLE_LENGTH - form.values.title.length;
	const descriptionSymbolsLeft =
		MAX_DESCRIPTION_LENGTH - form.values.description.length;

	const createPost = useStore(state => state.createPost);
	const updatePost = useStore(state => state.updatePost);
	const deletePost = useStore(state => state.deletePost);
	const { data: session } = useSession();
	const router = useRouter();

	if (!session) redirect('/auth/login');

	// Helper to upload new files and get URLs
	async function uploadFileClient(file: File, path: string): Promise<string> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('path', path);

		const res = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});
		if (!res.ok) throw new Error('Failed to upload file');
		const { url } = await res.json();
		return url;
	}

	// Upload files to the server
	async function uploadFiles(files: File[]): Promise<string[]> {
		return await Promise.all(
			files.map(file => uploadFileClient(file, file.name))
		);
	}

	// Handle removing existing files
	const handleRemoveExistingFile = (index: number) => {
		const updatedExistingFiles = [...existingFiles];
		updatedExistingFiles.splice(index, 1);
		setExistingFiles(updatedExistingFiles);

		// Update previews to reflect the removal
		const updatedPreviews = [...previews];
		updatedPreviews.splice(index, 1);
		setPreviews(updatedPreviews);
		form.setFieldValue('images', updatedPreviews);
	};

	// Handle removing new files
	const handleRemoveNewFile = (index: number) => {
		URL.revokeObjectURL(previews[index]);
		const updatedPreviews = [...previews];
		const updatedFiles = [...files];
		updatedPreviews.splice(index, 1);
		updatedFiles.splice(index, 1);
		setPreviews(updatedPreviews);
		setFiles(updatedFiles);
		form.setFieldValue('images', updatedPreviews);
	};

	// Handle removing any file by checking if it's in existingFiles
	const handleRemoveFile = (index: number) => {
		const fileUrl = previews[index];
		const existingIndex = existingFiles.indexOf(fileUrl);

		if (existingIndex !== -1) {
			// This is an existing file
			handleRemoveExistingFile(existingIndex);
		} else {
			// This is a new file
			console.log('Removing new file');
			const newFileIndex = index - existingFiles.length;
			if (newFileIndex >= 0 && newFileIndex < files.length) {
				handleRemoveNewFile(newFileIndex);
			} else {
				console.error('Invalid new file index:', newFileIndex);
			}
		}
	};

	async function handleSubmit(values: any) {
		setIsUploading(true);
		try {
			let fileUrls = [...existingFiles];

			if (files.length > 0) {
				const uploadedUrls = await uploadFiles(files);
				fileUrls = [...fileUrls, ...uploadedUrls];
			}

			if (post) {
				// UPDATE
				await updatePost(post.id, {
					title: values.title,
					description: values.description,
					topic: values.topic,
					files: fileUrls.map(url => ({
						url
					}))
				});
				notifications.show({
					title: 'Success!',
					message: 'Post updated successfully',
					color: 'green',
					autoClose: 2500
				});

				router.push('/');
			} else {
				// CREATE
				const formData = new FormData();
				formData.append('title', values.title);
				formData.append('description', values.description);
				formData.append('topic', String(values.topic));

				fileUrls.forEach(url => {
					formData.append('fileUrls', url);
				});

				await createPost(formData);
				notifications.show({
					title: 'Success!',
					message: 'Post created successfully',
					color: 'green',
					autoClose: 2500
				});
			}

			form.reset();
			setPreviews([]);
			setFiles([]);
			setExistingFiles([]);
		} catch (error) {
			notifications.show({
				title: 'Error',
				message:
					error instanceof Error
						? error.message
						: 'Failed to save post',
				color: 'red',
				autoClose: 2500
			});
		} finally {
			setIsUploading(false);
		}
	}

	async function handleDelete() {
		if (!post) return;
		if (confirm('Are you sure you want to delete this post?')) {
			try {
				await deletePost(post.id);
				notifications.show({
					title: 'Deleted',
					message: 'Post deleted successfully',
					color: 'green',
					autoClose: 2500
				});
				router.push('/');
			} catch (error) {
				notifications.show({
					title: 'Error',
					message: 'Failed to delete post',
					color: 'red',
					autoClose: 2500
				});
			}
		}
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)} className={classes.form}>
			{showSuccess && (
				<Alert
					variant='light'
					color='green'
					withCloseButton
					onClose={() => setShowSuccess(false)}
					mb='md'
				>
					Card created successfully!
				</Alert>
			)}

			<div className={classes.wrapper}>
				<Dropzone
					multiple
					openRef={openRef}
					onDrop={acceptedFiles => {
						// Check total files limit (existing + new)
						const totalFiles =
							existingFiles.length +
							files.length +
							acceptedFiles.length;
						if (totalFiles > 5) {
							notifications.show({
								title: 'Too many files',
								message: 'Maximum 5 files allowed',
								color: 'red'
							});
							return;
						}

						const newFiles = [...files, ...acceptedFiles];
						setFiles(newFiles);

						// Create previews for new files
						const newFilePreviews = acceptedFiles.map(file =>
							URL.createObjectURL(file)
						);

						// Combine existing previews with new ones
						const allPreviews = [...previews, ...newFilePreviews];
						setPreviews(allPreviews);

						form.setFieldValue('images', allPreviews);
					}}
					onReject={() => {
						notifications.show({
							title: 'File rejected',
							message: 'Please upload files under 4MB'
						});
					}}
					radius='md'
					className={classes.dropzone}
					accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif]}
					maxSize={4 * 1024 ** 2}
					key={form.key('images')}
					{...form.getInputProps('images')}
				>
					<div style={{ pointerEvents: 'none' }}>
						<Group justify='center'>
							<Dropzone.Accept>
								<IconDownload
									size={50}
									color={theme.colors.blue[6]}
									stroke={1.5}
								/>
							</Dropzone.Accept>
							<Dropzone.Reject>
								<IconX
									size={50}
									color={theme.colors.red[6]}
									stroke={1.5}
								/>
							</Dropzone.Reject>
							<Dropzone.Idle>
								<IconCloudUpload
									size={50}
									stroke={1.5}
									className={classes.icon}
								/>
							</Dropzone.Idle>
						</Group>

						<Text ta='center' fw={700} fz='lg' mt='xl'>
							<Dropzone.Accept>Drop files here</Dropzone.Accept>
							<Dropzone.Reject>
								File less than 4mb
							</Dropzone.Reject>
							<Dropzone.Idle>Upload files</Dropzone.Idle>
						</Text>

						<Text className={classes.description}>
							Drag&apos;n&apos;drop files here to upload. We can
							accept 5 <i>.png, jpeg</i> and <i>.gif</i> files
							that are less than 4mb in size each.
						</Text>
					</div>
				</Dropzone>

				<Button
					className={classes.control}
					size='md'
					radius='xl'
					onClick={() => openRef.current?.()}
				>
					Select files
				</Button>
			</div>

			{files.length > 5 && (
				<Text size='sm' mt='xs' className={classes.error}>
					More than 5 files provided
				</Text>
			)}

			{previews.length > 0 && (
				<div className={classes.previews}>
					{previews.map((preview, index) => (
						<div key={index} className={classes.previewWrapper}>
							<Image
								src={preview}
								alt={`Preview ${index + 1}`}
								width={100}
								height={100}
								className={classes.previewImage}
							/>
							<button
								type='button'
								className={classes.removePreview}
								onClick={() => handleRemoveFile(index)}
							>
								<IconX size={16} />
							</button>
						</div>
					))}
				</div>
			)}

			<TextInput
				withAsterisk
				label={`Title (${titleSymbolsLeft} symbols left)`}
				placeholder='Title'
				size='md'
				mb='sm'
				maxLength={100}
				key={form.key('title')}
				{...form.getInputProps('title')}
			/>

			{showTitleWarning && (
				<Alert
					variant='light'
					color='orange'
					icon={<IconAlertCircle size={18} />}
					mb='sm'
					withCloseButton
					onClose={() => setShowTitleWarning(false)}
				>
					Character limit reached
				</Alert>
			)}

			<Textarea
				withAsterisk
				label={`Description (${descriptionSymbolsLeft} symbols left)`}
				placeholder='Description'
				autosize
				size='md'
				maxLength={1000}
				mb='sm'
				key={form.key('description')}
				{...form.getInputProps('description')}
			/>

			{showDescriptionWarning && (
				<Alert
					variant='light'
					color='orange'
					icon={<IconAlertCircle size={18} />}
					mb='sm'
					withCloseButton
					onClose={() => setShowDescriptionWarning(false)}
				>
					Character limit reached
				</Alert>
			)}

			<Select
				mt='sm'
				size='md'
				label='Select topic'
				withAsterisk
				allowDeselect={false}
				data={TopicVars.filter(topicVar => topicVar !== 'all')}
				key={form.key('topic')}
				{...form.getInputProps('topic')}
			/>

			<Button
				type='submit'
				mt='sm'
				mb='md'
				fullWidth
				loading={isUploading}
			>
				{post ? 'Update Post' : 'Post'}
			</Button>
			{post && (
				<Button color='red' mt='sm' fullWidth onClick={handleDelete}>
					Delete Post
				</Button>
			)}
		</form>
	);
};

export default PostForm;
