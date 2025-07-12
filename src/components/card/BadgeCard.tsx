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
import classes from './badgeCard.module.css';
import { user } from '@/constants/header.constants';
import { useState } from 'react';

const mockdata = {
	image: user.image,
	title: 'CATMINT',
	extra: 'trending',
	description: 'This thing is awesome.',
	badges: [
		{ emoji: '☀️', label: 'Sunny everywhere' },
		{ emoji: '🦓', label: 'Friends' },
		{ emoji: '🌲', label: 'Nature' },
		{ emoji: '😍', label: 'CATMINT' }
	]
};

const BadgeCard = () => {
	const [favorite, setFavorite] = useState(false);
	const [inCollection, setInCollection] = useState(false);

	const handleAddToFavorites = () => {
		setFavorite(!favorite);
	};

	const handleAddToCollection = () => {
		setInCollection(!inCollection);
	};

	const { image, title, description, extra, badges } = mockdata;
	const features = badges.map(badge => (
		<Badge variant='light' key={badge.label} leftSection={badge.emoji}>
			{badge.label}
		</Badge>
	));

	return (
		<Card withBorder radius='md' p='md' className={classes.card}>
			<Card.Section>
				<Image
					src={image}
					alt={title}
					h={340}
					style={{ objectFit: 'contain' }}
				/>
			</Card.Section>

			<Card.Section className={classes.section} mt='md'>
				<Group justify='apart'>
					<Text fz='lg' fw={500}>
						{title}
					</Text>
					<Badge
						size='sm'
						variant='gradient'
						gradient={{ from: 'pink', to: 'orange', deg: 90 }}
					>
						{extra}
					</Badge>
				</Group>
				<Spoiler
					maxHeight={60}
					showLabel='Show more'
					hideLabel='Show less'
				>
					<Text fz='sm' mt='xs'>
						{description}pekg rgbkpo sertrpkgh efl rkgoper tjrfj
						e5kdtn ,mtydm bvn ktykmth rena sehnplop aerporkgh Lorem
						ipsum dolor sit amet consectetur adipisicing elit.
						Error, enim ullam. Optio dolorum quidem numquam illum
						pariatur a quae voluptatem voluptatibus consequuntur
						aliquid, dolor alias iste repellendus architecto
						repellat nemo.
					</Text>
				</Spoiler>
			</Card.Section>

			<Card.Section className={classes.section}>
				<Text mt='md' className={classes.label} c='dimmed'>
					Perfect for you, if you enjoy
				</Text>
				<Group gap={7} mt={5}>
					{features}
				</Group>
			</Card.Section>

			<Group mt='xs' align='center'>
				<UnstyledButton className={classes.user}>
					<Group gap={8} align='center'>
						<Avatar src={user.image} radius='xl' />

						<Text className={classes.user_name} size='sm' fw={500}>
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
							<IconHeart className={classes.like} stroke={1.5} />
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
						<IconShare2 className={classes.share} stroke={1.5} />
					</ActionIcon>
				</Group>
			</Group>
		</Card>
	);
};

export default BadgeCard;
