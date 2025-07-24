'use client';

import { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Group,
	Avatar,
	Text,
	Divider,
	Stack,
	Center,
	Tabs,
	useMantineTheme,
	Box
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import {
	IconHeart,
	IconBookmark,
	IconUser,
	IconTrash,
	IconLogout,
	IconEdit
} from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import classes from './page.module.css';
import { useStore } from '@/lib/store';
import BadgeCard from '@/components/card/BadgeCard';
import { PostType } from '@/shared/types/post.types';
import FooterSocial from '@/widgets/footer/FooterSocial';

const Profile = () => {
	const currentUser = useStore(state => state.currentUser);
	const deleteUser = useStore(state => state.deleteUser);
	const fetchLikedPosts = useStore(state => state.fetchLikedPosts);
	const fetchCollectionPosts = useStore(state => state.fetchCollectionPosts);
	const onLikePost = useStore(state => state.likePost);
	const onAddToCollection = useStore(state => state.addToCollection);
	const [likedPosts, setLikedPosts] = useState<PostType[]>([]);
	const [collectionPosts, setCollectionPosts] = useState<PostType[]>([]);
	const router = useRouter();
	const theme = useMantineTheme();

	useEffect(() => {
		if (currentUser?.id) {
			fetchLikedPosts().then(posts => setLikedPosts(posts));
			fetchCollectionPosts().then(posts => setCollectionPosts(posts));
		}
	}, [currentUser, fetchLikedPosts, fetchCollectionPosts]);

	const handleEditProfile = async () => {
		router.push('/profile/edit');
	};

	const handleSignOut = async () => {
		await signOut();
		router.push('/');
	};

	const handleDeleteProfile = async () => {
		await deleteUser();
		await signOut();
		router.push('/');
	};

	return (
		<Center className={classes.profile}>
			<Card
				shadow='md'
				radius='lg'
				p='xl'
				style={{ minWidth: 320, maxWidth: 600, width: '100%' }}
			>
				<Stack align='center' gap='md' style={{ width: '100%' }}>
					<Avatar
						src={currentUser?.image || undefined}
						size={100}
						radius={100}
						alt={currentUser?.name || 'User'}
						color='blue'
					>
						{!currentUser?.image && <IconUser size={48} />}
					</Avatar>
					<Text size='xl' fw={700} mt='sm'>
						{currentUser?.name}
					</Text>
					<Divider my='sm' />
					<Group gap='xl' align='center'>
						<Group gap={4} align='center'>
							<IconHeart size={20} color={theme.colors.red[6]} />
							<Text size='md' fw={500}>
								{likedPosts.length} Liked posts
							</Text>
						</Group>
						<Group gap={4} align='center'>
							<IconBookmark
								size={20}
								color={theme.colors.blue[6]}
							/>
							<Text size='md' fw={500}>
								{collectionPosts.length} In collection
							</Text>
						</Group>
					</Group>
					<Divider my='sm' />
					<Tabs defaultValue='liked' w='100%'>
						<Tabs.List grow>
							<Tabs.Tab
								value='liked'
								leftSection={<IconHeart size={16} />}
							>
								Liked
							</Tabs.Tab>
							<Tabs.Tab
								value='collections'
								leftSection={<IconBookmark size={16} />}
							>
								Collections
							</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value='liked' pt='md'>
							{likedPosts.length === 0 ? (
								<Text c='center text-dimmed'>
									No liked posts yet.
								</Text>
							) : (
								<Box className={classes.carouselWrapper}>
									<Carousel
										slideSize='100%'
										withIndicators
										mb='xl'
									>
										{likedPosts.map(post => (
											<Carousel.Slide key={post.id}>
												<BadgeCard
													post={post}
													currentUser={currentUser}
													onLike={onLikePost}
													onAddToCollection={
														onAddToCollection
													}
												/>
											</Carousel.Slide>
										))}
									</Carousel>
								</Box>
							)}
						</Tabs.Panel>
						<Tabs.Panel value='collections' pt='md'>
							{collectionPosts.length === 0 ? (
								<Text c='center text-dimmed'>
									No posts in collections yet.
								</Text>
							) : (
								<Box className={classes.carouselWrapper}>
									<Carousel
										slideSize='100%'
										withIndicators
										mb='xl'
									>
										{collectionPosts.map(post => (
											<Carousel.Slide key={post.id}>
												<BadgeCard
													post={post}
													currentUser={currentUser}
													onLike={onLikePost}
													onAddToCollection={
														onAddToCollection
													}
												/>
											</Carousel.Slide>
										))}
									</Carousel>
								</Box>
							)}
						</Tabs.Panel>
					</Tabs>
					<Divider my='xs' />
					<Group
						gap='md'
						w='100%'
						style={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap'
						}}
					>
						{currentUser?.password !== null && (
							<Button
								leftSection={<IconEdit size={18} />}
								color='gray'
								variant='light'
								onClick={handleEditProfile}
								fullWidth
							>
								Edit Profile
							</Button>
						)}
						<Button
							leftSection={<IconLogout size={18} />}
							color='gray'
							variant='light'
							onClick={handleSignOut}
							fullWidth
						>
							Sign out
						</Button>
						<Button
							leftSection={<IconTrash size={18} />}
							color='red'
							variant='outline'
							onClick={handleDeleteProfile}
							fullWidth
						>
							Delete Profile
						</Button>
					</Group>
				</Stack>
			</Card>
			<FooterSocial />
		</Center>
	);
};

export default Profile;
