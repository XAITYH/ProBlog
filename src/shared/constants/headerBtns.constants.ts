import { NavLink } from '../types/navLink.types';

export const NAV_BUTTONS: NavLink[] = [
	{
		label: 'Log in',
		href: '/login',
		key: 'login',
		type: 'button'
	},
	{
		label: 'Sign up',
		href: '/register',
		key: 'register',
		type: 'button'
	}
];
