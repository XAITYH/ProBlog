'use client';

import classes from './page.module.css';
import { useState } from 'react';
import BadgeCards from '@/components/card/BadgeCards';
import { FooterSocial } from '@/widgets/footer/FooterSocial';
import { TopicControl } from '@/widgets/topicControl/TopicControl';
import { TopicTypes } from '@/shared/types/topics.types';

const Home = () => {
	const [currentTopic, setCurrentTopic] = useState<TopicTypes>('all');

	return (
		<div className={classes.main_page_container}>
			<TopicControl
				currentTopic={currentTopic}
				setCurrentTopic={setCurrentTopic}
			/>
			<BadgeCards currentTopic={currentTopic} />
			<FooterSocial />
		</div>
	);
};

export default Home;
