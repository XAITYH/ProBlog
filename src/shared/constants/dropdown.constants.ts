import { IconCat, IconCode, IconNews, IconXd } from '@tabler/icons-react';
import { DropdownLink } from '../types/dropdownLink.constants';

export const mockdata: DropdownLink[] = [
	{
		icon: IconCode,
		title: 'Project',
		description: 'Show everyone your project'
	},
	{
		icon: IconNews,
		title: 'News',
		description: 'Share the latest news'
	},
	{
		icon: IconXd,
		title: 'Meme',
		description: 'Make our community laugh'
	},
	{
		icon: IconCat,
		title: 'Pet',
		description: 'Show your cutie-patootie pet'
	}
];
