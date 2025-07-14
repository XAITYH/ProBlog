'use client';

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
import { user } from '@/shared/constants/user.constants';
import { useState } from 'react';
import { Post } from '@/shared/types/post.types';
import posts from '@/data/posts.json';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Zoom } from 'yet-another-react-lightbox/plugins';

import classes from './badgeCard.module.css';

const BadgeCard = () => {
	const [favorite, setFavorite] = useState<boolean>(false);
	const [inCollection, setInCollection] = useState<boolean>(false);
	const [opened, setOpened] = useState<number | null>(null);

	const handleAddToFavorites = () => {
		setFavorite(!favorite);
	};

	const handleAddToCollection = () => {
		setInCollection(!inCollection);
	};

	return (
		<>
			{posts.map((post: Post) => (
				<Card
					withBorder
					radius='md'
					p='md'
					className={classes.card}
					key={post.id}
				>
					{post.images.length > 0 && (
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
									disableSwipeNavigation:
										post.images.length < 2
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
						mt={post.images.length > 0 ? 'md' : 0}
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
								<Avatar src={user.image} radius='xl' />

								<Text
									className={classes.user_name}
									size='sm'
									fw={500}
								>
									{user.name}
								</Text>
							</Group>
						</UnstyledButton>

						<Group gap={10}>
							<ActionIcon
								variant='default'
								radius='md'
								size={36}
								onClick={handleAddToFavorites}
							>
								{favorite ? (
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
								{inCollection ? (
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
			))}
		</>
	);
};

export default BadgeCard;
