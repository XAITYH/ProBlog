'use client';

import { SegmentedControl } from '@mantine/core';
import classes from './topicControl.module.css';
import { TopicVars } from '@/shared/constants/topics.constants';
import { TopicTypes } from '@/shared/types/topics.types';

type topicControlProps = {
	currentTopic: TopicTypes;
	setCurrentTopic: (topic: TopicTypes) => void;
};

export function TopicControl({
	currentTopic,
	setCurrentTopic
}: topicControlProps) {
	return (
		<SegmentedControl
			radius='xl'
			size='md'
			data={TopicVars}
			classNames={classes}
			value={currentTopic}
			onChange={value => setCurrentTopic(value as TopicTypes)}
		/>
	);
}
