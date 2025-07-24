'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import CardsList from '@/components/cardsList/CardsList';
import FooterSocial from '@/widgets/footer/FooterSocial';
import { TopicControl } from '@/features/topicControl/TopicControl';
import { TopicTypes } from '@/shared/types/topics.types';
import classes from './page.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

const Home = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const topic = (searchParams.get('topic') as TopicTypes) || 'all';

	const refreshPosts = useStore(state => state.refreshPosts);

	// Refresh posts when topic changes
	useEffect(() => {
		refreshPosts();
	}, [topic, refreshPosts]);

	const setCurrentTopic = (newTopic: TopicTypes) => {
		const params = new URLSearchParams(searchParams);
		if (newTopic === 'all') {
			params.delete('topic');
		} else {
			params.set('topic', newTopic);
		}
		router.replace(`/?${params.toString()}`, { scroll: false });
	};

	return (
		<div className={classes.main_page_container}>
			<TopicControl
				currentTopic={topic}
				setCurrentTopic={setCurrentTopic}
			/>
			<CardsList currentTopic={topic} />
			<FooterSocial />
		</div>
	);
};

export default Home;
