// src/components/card/BadgeCardSkeleton.tsx
import { Card, CardSection, Group, Skeleton, Spoiler } from '@mantine/core';
import classes from './cardSkeleton.module.css';

export function BadgeCardSkeleton() {
	return (
		<Card withBorder radius='md' p='md' className={classes.card}>
			{/* Image section */}
			<Skeleton height={180} radius='md' mb='md' />

			<CardSection className={classes.section} mt='md'>
				<Group justify='apart'>
					<Skeleton height={24} width='60%' />
					<Skeleton height={20} width={60} radius='xl' />
				</Group>
				<Spoiler maxHeight={60} showLabel='' hideLabel=''>
					<Skeleton height={16} width='100%' mt='xs' />
					<Skeleton height={16} width='90%' mt='xs' />
				</Spoiler>
			</CardSection>

			<Group mt='xs' align='center'>
				<Skeleton height={24} width={80} radius='xl' />
				<Group gap={10}>
					<Skeleton height={36} width={36} radius='xl' />
					<Skeleton height={36} width={36} radius='xl' />
					<Skeleton height={36} width={36} radius='xl' />
				</Group>
			</Group>
		</Card>
	);
}
