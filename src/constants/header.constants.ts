import { IconCat, IconCode, IconNews, IconXd } from '@tabler/icons-react';
import { IUser } from '@/shared/types/user.types';

export const user: IUser = {
	name: 'Boris Snoopcat',
	email: 'boris@snoopcat.com',
	image: '/snoopcat.jpg'
};

export const mockdata = [
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
