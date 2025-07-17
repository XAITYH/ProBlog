'use client';

import React, { useState } from 'react';

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
	Image,
	Spoiler,
	Text,
	UnstyledButton
} from '@mantine/core';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { Zoom } from 'yet-another-react-lightbox/plugins';
import { PostType } from '@/shared/types/post.types';
import { UserType } from '@/shared/types/user.types';

type BadgeCardTypes = {
	post: PostType;
	currentUser?: UserType | null;
	onLike: (postId: number) => void;
	onAddToCollection: (postId: number) => void;
};

const BadgeCard = React.memo(
	({ post, currentUser, onLike, onAddToCollection }: BadgeCardTypes) => {
		const [opened, setOpened] = useState<number | null>(null);

		return (
			<Card
				withBorder
				radius='md'
				p='md'
				className={classes.card}
				key={post.id}
			>
				{post.images && (
					<>
						<Card.Section>
							<Image
								key={post.id}
								src={post.images[0]}
								className={classes.image}
								loading='lazy'
								onClick={() => setOpened(post.id)}
							/>
						</Card.Section>

						<Lightbox
							open={post.id === opened}
							close={() => setOpened(null)}
							plugins={[Zoom]}
							slides={post.images.map(image => ({
								src: image
							}))}
							controller={{
								disableSwipeNavigation: post.images.length < 2
							}}
							render={
								post.images.length < 2
									? {
											buttonNext: () => null,
											buttonPrev: () => null
									  }
									: {}
							}
						/>
					</>
				)}

				<Card.Section
					className={classes.section}
					mt={post.images ? 'md' : 0}
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
