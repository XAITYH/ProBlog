'use client';

import { useState } from 'react';

import classes from './page.module.css';

import CardsList from '@/components/cardsList/CardsList';

import { FooterSocial } from '@/widgets/footer/FooterSocial';
import { TopicControl } from '@/features/topicControl/TopicControl';

import { TopicTypes } from '@/shared/types/topics.types';

const Home = () => {
	const [currentTopic, setCurrentTopic] = useState<TopicTypes>('all');

	return (
		<div className={classes.main_page_container}>
			<TopicControl
				currentTopic={currentTopic}
				setCurrentTopic={setCurrentTopic}
			/>
			<CardsList currentTopic={currentTopic} />
			<FooterSocial />
		</div>
	);
};

export default Home;
