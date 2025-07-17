import { TopicTypes } from './topics.types';

export type PostType = {
	id: number;
	topic: Omit<TopicTypes, 'all'>;
	images?: string[];
	title: string;
	extra?: string;
	description: string;
};
