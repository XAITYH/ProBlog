import { TablerIcon } from '@tabler/icons-react';
import { TopicTypes } from './topics.types';

export type DropdownLink = {
	icon: TablerIcon;
	title: string;
	description: string;
	topic: TopicTypes;
};
