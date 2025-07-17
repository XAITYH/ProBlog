import { IconChevronDown } from '@tabler/icons-react';
import { NavLink } from '../types/navLink.types';
import { mockdata } from './dropdown.constants';

export const NAV_LINKS: NavLink[] = [
	{
		label: 'Home',
		href: '/',
		key: 'home',
		type: 'link'
	},
	{
		label: 'Create a post',
		href: '/create-post',
		key: 'create-post',
		type: 'dropdown',
		icon: IconChevronDown,
		dropdownItems: mockdata
	},
	{
		label: 'Get Help',
		href: '/help',
		key: 'help',
		type: 'link'
	}
];
