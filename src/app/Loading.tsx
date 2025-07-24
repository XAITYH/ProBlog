import { Stack } from '@mantine/core';
import { TopicControlSkeleton } from '@/components/topicControlSkeleton/TopicControlSkeleton';
import { BadgeCardSkeleton } from '@/components/cardSkeleton/BadgeCardSkeleton';
import classes from './loading.module.css';

export default function Loading() {
	return <div className={classes.loader}></div>;
}
