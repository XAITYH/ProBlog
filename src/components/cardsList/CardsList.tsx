'use client';

import { useMemo } from 'react';

import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';

import { TopicTypes } from '@/shared/types/topics.types';
import { PostType } from '@/shared/types/post.types';
import { Text } from '@mantine/core';

import BadgeCard from '../card/BadgeCard';

const CardsList = ({ currentTopic }: { currentTopic: TopicTypes }) => {
	const posts = useStore(useShallow(state => state.posts));
	const currentUser = useStore(useShallow(state => state.currentUser));

	const likePost = useStore(useShallow(state => state.likePost));
	const addToCollection = useStore(
		useShallow(state => state.addToCollection)
	);

	const filteredPosts = useMemo(
		() =>
			currentTopic === 'all'
				? posts
				: posts.filter(post => post.topic === currentTopic),
		[currentTopic, posts]
	);

	const handleLike = (postId: number) => {
		likePost(postId);
	};

	const handleAddToCollection = (postId: number) => {
		addToCollection(postId);
	};

	return (
		<>
			{filteredPosts.length > 0 ? (
				filteredPosts.map((post: PostType) => (
					<BadgeCard
						key={post.id}
						post={post}
						currentUser={currentUser}
						onLike={handleLike}
						onAddToCollection={handleAddToCollection}
					/>
				))
			) : (
				<Text>There are no posts on this topic.</Text>
			)}
		</>
	);
};

export default CardsList;
