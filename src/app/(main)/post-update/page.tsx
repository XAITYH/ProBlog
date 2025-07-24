'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PostForm from '@/features/postForm/PostForm';
import { useStore } from '@/lib/store';
import { PostType } from '@/shared/types/post.types';
import Loader from '@/components/loader/Loader';
import { Center, Text } from '@mantine/core';

const PostUpdate = () => {
	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const posts = useStore(state => state.posts);
	const [post, setPost] = useState<PostType | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;
		const found = posts.find(p => p.id === Number(id));
		if (found) {
			setPost(found);
			setLoading(false);
		} else {
			fetch(`/api/posts/${id}`)
				.then(res => (res.ok ? res.json() : Promise.reject(res)))
				.then(data => {
					setPost(data.post);
					setLoading(false);
				})
				.catch(() => {
					setPost(null);
					setLoading(false);
				});
		}
	}, [id, posts]);

	if (loading) {
		return <Loader />;
	}
	if (!post) {
		return (
			<Center>
				<Text>Post not found</Text>
			</Center>
		);
	}
	return <PostForm post={post} />;
};

export default PostUpdate;
