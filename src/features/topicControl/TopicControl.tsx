'use client';

import { SegmentedControl } from '@mantine/core';
import classes from './topicControl.module.css';
import { TopicVars } from '@/shared/constants/topics.constants';
import { TopicTypes } from '@/shared/types/topics.types';
import { useMediaQuery } from '@mantine/hooks';

type topicControlProps = {
	currentTopic: TopicTypes;
	setCurrentTopic: (topic: TopicTypes) => void;
};

export function TopicControl({
	currentTopic,
	setCurrentTopic
}: topicControlProps) {
	const isMobile = useMediaQuery('(max-width: 360px)');

	return (
		<SegmentedControl
			orientation={isMobile ? 'vertical' : 'horizontal'}
			size='md'
			radius='xl'
			data={TopicVars}
			classNames={classes}
			value={currentTopic}
			onChange={value => setCurrentTopic(value as TopicTypes)}
		/>
	);
}
