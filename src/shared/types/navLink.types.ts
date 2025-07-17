import { TablerIcon } from '@tabler/icons-react';
import { DropdownLink } from '@/shared/types/dropdownLink.types';

export type NavLink = {
	label: string;
	href: string;
	key: string;
	type: 'link' | 'dropdown' | 'button';
	icon?: TablerIcon;
	dropdownItems?: DropdownLink[];
};
