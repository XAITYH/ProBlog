'use client';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { TopicTypes } from '@/shared/types/topics.types';
import BadgeCard from '../card/BadgeCard';
import { Group, Text } from '@mantine/core';
import { BadgeCardSkeleton } from '../cardSkeleton/BadgeCardSkeleton';

const CardsList = ({ currentTopic }: { currentTopic: TopicTypes }) => {
	const { ref, inView } = useInView();
	const {
		posts,
		currentUser,
		likePost,
		addToCollection,
		deletePost,
		fetchPosts,
		nextCursor,
		isLoading
	} = useStore(
		useShallow(state => ({
			posts: state.posts,
			currentUser: state.currentUser,
			likePost: state.likePost,
			addToCollection: state.addToCollection,
			deletePost: state.deletePost,
			fetchPosts: state.fetchPosts,
			nextCursor: state.nextCursor,
			isLoading: state.isLoadingPosts
		}))
	);

	useEffect(() => {
		if (inView && nextCursor && !isLoading) {
			fetchPosts(currentTopic, nextCursor);
		}
	}, [inView, nextCursor, currentTopic, fetchPosts, isLoading]);

	const filteredPosts = useMemo(
		() =>
			currentTopic === 'all'
				? posts
				: posts.filter(post => post.topic === currentTopic),
		[currentTopic, posts]
	);

	return (
		<div className='space-y-4'>
			{filteredPosts.map(post => (
				<BadgeCard
					key={post.id}
					post={post}
					currentUser={currentUser}
					onLike={likePost}
					onAddToCollection={addToCollection}
					onDelete={deletePost}
				/>
			))}

			<div ref={ref} className='flex items-center py-4 flex-col gap-4'>
				{isLoading ? (
					<>
						<BadgeCardSkeleton />
						<BadgeCardSkeleton />
						<BadgeCardSkeleton />
					</>
				) : filteredPosts.length === 0 ? (
					<Text>There are no posts on this topic.</Text>
				) : null}
			</div>
		</div>
	);
};

export default CardsList;
