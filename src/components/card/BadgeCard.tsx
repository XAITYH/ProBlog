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

type BadgeCardTypes = {
	post: PostType;
	currentUser?: UserType | null;
	onLike: (postId: number) => void;
	onAddToCollection: (postId: number) => void;
};

const BadgeCard = React.memo(
	({ post, currentUser, onLike, onAddToCollection }: BadgeCardTypes) => {
		return (
			<Card
				withBorder
				radius='md'
				p='md'
				className={classes.card}
				key={post.id}
			>
				{post.images && post.images?.length > 0 && (
					<ImageSection post={post} />
				)}

				<Card.Section
					className={classes.section}
					mt={post.images && post.images.length > 0 ? 'md' : 0}
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

				<Group mt='xs' align='center'>
					<UnstyledButton className={classes.user}>
						<Group gap={8} align='center'>
							<Avatar src={currentUser?.image} radius='xl' />

							<Text
								className={classes.user_name}
								size='sm'
								fw={500}
							>
								{currentUser?.name}
							</Text>
						</Group>
					</UnstyledButton>

					<Group gap={10}>
						<ActionIcon
							variant='default'
							radius='md'
							size={36}
							onClick={() => onLike(post.id)}
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
							onClick={() => onAddToCollection(post.id)}
						>
							{currentUser?.postsInCollection?.includes(
								post.id
							) ? (
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
						<ActionIcon variant='default' radius='md' size={36}>
							<IconShare2
								className={classes.share}
								stroke={1.5}
							/>
						</ActionIcon>
					</Group>
				</Group>
			</Card>
		);
	}
);

export default BadgeCard;
