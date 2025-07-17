'use client';

import { useRef, useState } from 'react';
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
	Text,
	Textarea,
	TextInput,
	useMantineTheme
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import classes from './createForm.module.css';
import { PostType } from '@/shared/types/post.types';
import { useStore } from '@/lib/store';
import { notifications } from '@mantine/notifications';
import { DropdownLink } from '@/shared/types/dropdownLink.types';

const CreateForm = ({ topic }: Pick<DropdownLink, 'topic'>) => {
	const MAX_TITLE_LENGTH = 100;
	const MAX_DESCRIPTION_LENGTH = 1000;

	const [showTitleWarning, setShowTitleWarning] = useState(false);
	const [showDescriptionWarning, setShowDescriptionWarning] = useState(false);

	const [showSuccess, setShowSuccess] = useState(false);

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			image: '',
			title: '',
			description: ''
		},

		validate: {
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

	function newPost(postData: Omit<PostType, 'id'>) {
		try {
			createPost(postData);
			form.reset();

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
				autoClose: 3000
			});
		}
	}

	return (
		<form
			onSubmit={form.onSubmit(values => newPost({ topic, ...values }))}
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
					openRef={openRef}
					onDrop={() => {}}
					radius='md'
					className={classes.dropzone}
					accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif]}
					maxSize={10 * 1024 ** 2}
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
							accept <i>.png, jpeg</i> and <i>.gif</i> files that
							are less than 10mb in size.
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

			<Button type='submit' mt='sm' fullWidth>
				Post
			</Button>
		</form>
	);
};

export default CreateForm;
