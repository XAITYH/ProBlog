import { TablerIcon } from '@tabler/icons-react';

export type NavLink = {
	label: string;
	href: string;
	key: string;
	type: 'link' | 'dropdown' | 'button';
	icon?: TablerIcon;
	dropdownItems?: {
		title: string;
		description: string;
		icon: TablerIcon;
	}[];
};
