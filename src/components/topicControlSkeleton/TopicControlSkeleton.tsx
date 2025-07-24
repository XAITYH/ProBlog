// src/features/topicControl/TopicControlSkeleton.tsx
import { Group, Skeleton } from '@mantine/core';

export function TopicControlSkeleton() {
	return (
		<Group mb='md'>
			<Skeleton height={36} width={90} radius='xl' />
			<Skeleton height={36} width={90} radius='xl' />
			<Skeleton height={36} width={90} radius='xl' />
			<Skeleton height={36} width={90} radius='xl' />
		</Group>
	);
}
