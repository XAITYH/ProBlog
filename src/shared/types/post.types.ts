import { TopicTypes } from './topics.types';
import { UserType } from './user.types';

export type PostType = {
	id: number;
	topic: Omit<TopicTypes, 'all'>;
	files?: {
		url: string;
		fileName: string;
	}[];
	title: string;
	extra?: string;
	description: string;
	likedBy?: number[];
	collections?: number[];
	author?: UserType;
	authorId?: string;
};
