import { IconCat, IconCode, IconNews, IconXd } from '@tabler/icons-react';
import { DropdownLink } from '../types/dropdownLink.types';

export const mockdata: DropdownLink[] = [
	{
		icon: IconCode,
		title: 'Project',
		description: 'Show everyone your project',
		topic: 'projects'
	},
	{
		icon: IconNews,
		title: 'News',
		description: 'Share the latest news',
		topic: 'news'
	},
	{
		icon: IconXd,
		title: 'Meme',
		description: 'Make our community laugh',
		topic: 'memes'
	},
	{
		icon: IconCat,
		title: 'Pet',
		description: 'Show your cutie-patootie pet',
		topic: 'pets'
	}
];
