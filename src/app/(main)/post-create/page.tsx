'use client';

import PostForm from '@/features/postForm/PostForm';
import { TopicVars } from '@/shared/constants/topics.constants';
import { TopicTypes } from '@/shared/types/topics.types';
import { Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

const PostCreate = () => {
	const searchParams = useSearchParams();
	const topic = searchParams.get('topic');

	if (topic && TopicVars.includes(topic as TopicTypes)) {
		return <PostForm />;
	} else {
		return (
			<div>
				<Text className='text-center'>Unknown topic</Text>
			</div>
		);
	}
};

export default PostCreate;
