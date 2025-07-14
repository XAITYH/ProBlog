'use client';

import { SegmentedControl } from '@mantine/core';
import classes from './topicControl.module.css';

export function TopicControl() {
	return (
		<SegmentedControl
			radius='xl'
			size='md'
			data={['All', 'Projects', 'Memes', 'Pets']}
			classNames={classes}
		/>
	);
}
