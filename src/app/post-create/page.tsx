'use client';

import CreateForm from '@/features/createForm/createForm';
import { TopicVars } from '@/shared/constants/topics.constants';
import { Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

const PostCreate = () => {
	const searchParams = useSearchParams();
	const topic = searchParams.get('topic');

	if (topic === TopicVars.find(topicVar => topicVar === topic))
		return <CreateForm topic={topic} />;
	else
		return (
			<div>
				<Text className='text-center'>Unknown topic</Text>
			</div>
		);
};

export default PostCreate;
