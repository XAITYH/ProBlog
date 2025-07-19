'use client';

import { useRef, useState } from 'react';

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

import { TopicTypes } from '@/shared/types/topics.types';
import { TopicVars } from '@/shared/constants/topics.constants';

import validateImageFile from './imagesFunctions/validateFile';
import Image from 'next/image';

type PostFormType = {
	images?: string[];
	title?: string;
	description?: string;
	topic: Omit<TopicTypes, 'all'>;
};

const PostForm = ({ images, title, description, topic }: PostFormType) => {
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const [showTitleWarning, setShowTitleWarning] = useState(false);
	const [showDescriptionWarning, setShowDescriptionWarning] = useState(false);

	const [showSuccess, setShowSuccess] = useState(false);

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			images: images ? images : [],
			title: title ? title : '',
			description: description ? description : '',
			topic: topic
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

	const handleDrop = (acceptedFiles: File[]) => {
		const validFiles = acceptedFiles.filter(file => {
			const validation = validateImageFile(file);
			if (!validation.isValid) {
				validation.errors.forEach(error => {
					notifications.show({
						title: 'Invalid file',
						message: error,
						color: 'red'
					});
				});
				return false;
			}
			return true;
		});

		const newPreviews = validFiles.map(file => URL.createObjectURL(file));

		setFiles(prev => [...prev, ...validFiles]);
		setPreviews(prev => [...prev, ...newPreviews]);
	};

	const theme = useMantineTheme();
	const openRef = useRef<() => void>(null);

	const titleSymbolsLeft = MAX_TITLE_LENGTH - form.values.title.length;
	const descriptionSymbolsLeft =
		MAX_DESCRIPTION_LENGTH - form.values.description.length;

	const createPost = useStore(state => state.createPost);

	async function newPost(postData: Omit<PostType, 'id'>) {
		setIsUploading(true);
		try {
			createPost(postData);

			form.reset();
			setPreviews([]);
			setFiles([]);

			notifications.show({
				title: 'Success!',
				message: 'Post created successfully',
				color: 'green',
				autoClose: 3000
			});
		} catch (error) {
			notifications.show({
				title: 'Error',
				message:
					error instanceof Error
						? error.message
						: 'Failed to create post',
				color: 'red',
				autoClose: 2500
			});
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<form
			onSubmit={form.onSubmit(values => {
				try {
					newPost(values);
				} catch (error) {
					notifications.show({
						title: 'Error',
						message:
							error instanceof Error
								? error.message
								: 'Upload failed',
						color: 'red'
					});
				}
			})}
			className={classes.form}
		>
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
					onDrop={handleDrop}
					radius='md'
					className={classes.dropzone}
					accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif]}
					maxSize={10 * 1024 ** 2}
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
								File less than 10mb
							</Dropzone.Reject>
							<Dropzone.Idle>Upload files</Dropzone.Idle>
						</Text>

						<Text className={classes.description}>
							Drag&apos;n&apos;drop files here to upload. We can
							accept 5 <i>.png, jpeg</i> and <i>.gif</i> files
							that are less than 10mb each in size.
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
				<div
					className={
						files.length > 5
							? `${classes.previews} ${classes.previews_error}`
							: `${classes.previews}`
					}
				>
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
								onClick={() => {
									const updatedPreviews = [...previews];
									const updatedFiles = [...files];
									updatedPreviews.splice(index, 1);
									updatedFiles.splice(index, 1);
									setPreviews(updatedPreviews);
									setFiles(updatedFiles);
								}}
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

			<Button type='submit' mt='sm' fullWidth>
				Post
			</Button>
		</form>
	);
};

export default PostForm;
