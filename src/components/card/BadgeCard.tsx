'use client';

import React from 'react';

import classes from './badgeCard.module.css';

import {
	IconBookmark,
	IconBookmarkFilled,
	IconHeart,
	IconHeartFilled,
	IconShare2
} from '@tabler/icons-react';

import {
	ActionIcon,
	Avatar,
	Badge,
	Button,
	Card,
	Group,
	Spoiler,
	Text,
	UnstyledButton
} from '@mantine/core';

import 'yet-another-react-lightbox/styles.css';

import { PostType } from '@/shared/types/post.types';
import { UserType } from '@/shared/types/user.types';
import ImageSection from './ui/ImageSection';
import { useRouter } from 'next/navigation';

type BadgeCardTypes = {
	post: PostType;
	currentUser?: UserType | null;
	onLike?: (postId: number) => Promise<void>;
	onAddToCollection?: (postId: number) => Promise<void>;
	onDelete?: (postId: number) => Promise<void>;
};

const BadgeCard = React.memo(
	({
		post,
		currentUser,
		onLike,
		onAddToCollection,
		onDelete
	}: BadgeCardTypes) => {
		const router = useRouter();

		const handleLike = async () => {
			if (!currentUser) {
				router.push('/auth/login');
				return;
			}

			await onLike?.(post.id);
		};

		const handleAddToCollection = async () => {
			if (!currentUser) {
				router.push('/auth/login');
				return;
			}

			await onAddToCollection?.(post.id);
		};

		return (
			<Card
				withBorder
				radius='md'
				p='md'
				className={classes.card}
				key={post.id}
			>
				{post.files && post.files?.length > 0 && (
					<ImageSection post={post} />
				)}

				<Card.Section
					className={classes.section}
					mt={post.files && post.files.length > 0 ? 'md' : 0}
				>
					<Group justify='apart'>
						<Text fz='lg' fw={500}>
							{post.title}
						</Text>

						{post.extra && (
							<Badge
								size='sm'
								variant='gradient'
								gradient={{
									from: 'pink',
									to: 'orange',
									deg: 90
								}}
								className={classes.extra}
							>
								{post.extra}
							</Badge>
						)}
					</Group>
					<Spoiler
						maxHeight={60}
						showLabel='Show more'
						hideLabel='Show less'
					>
						<Text fz='sm' mt='xs'>
							{post.description}
						</Text>
					</Spoiler>
				</Card.Section>

				<Group mt='xs' align='center' justify='space-between'>
					<Group gap={8} align='center'>
						{currentUser?.id === post.author?.id ? (
							<>
								<Button
									size='xs'
									onClick={() =>
										router.push(
											`/post-update?id=${post.id}`
										)
									}
								>
									Edit
								</Button>
								<Button
									variant='light'
									size='xs'
									color='red'
									onClick={async () => {
										if (confirm('Delete this post?')) {
											await onDelete?.(post.id);
										}
									}}
								>
									Delete
								</Button>
							</>
						) : (
							<UnstyledButton className={classes.user}>
								{post.author?.image && (
									<Avatar
										src={post.author.image}
										alt={post.author.name}
									/>
								)}
								<Text
									className={classes.user_name}
									size='sm'
									fw={500}
								>
									{post.author?.name}
								</Text>
							</UnstyledButton>
						)}
					</Group>

					<Group gap={10}>
						<ActionIcon
							variant='default'
							radius='md'
							size={36}
							onClick={handleLike}
						>
							{currentUser?.likedPosts?.includes(post.id) ? (
								<IconHeartFilled
									className={classes.like}
									stroke={1.5}
								/>
							) : (
								<IconHeart
									className={classes.like}
									stroke={1.5}
								/>
							)}
						</ActionIcon>
						<ActionIcon
							variant='default'
							radius='md'
							size={36}
							onClick={handleAddToCollection}
						>
							{currentUser?.collections?.includes(post.id) ? (
								<IconBookmarkFilled
									className={classes.bookmark}
									stroke={1.5}
								/>
							) : (
								<IconBookmark
									className={classes.bookmark}
									stroke={1.5}
								/>
							)}
						</ActionIcon>

						{/* 

						<ActionIcon
							variant='default'
							radius='md'
							size={36}
						>
							<IconShare2
								className={classes.share}
								stroke={1.5}
							/>
						</ActionIcon>

						*/}
					</Group>
				</Group>
			</Card>
		);
	}
);

export default BadgeCard;
