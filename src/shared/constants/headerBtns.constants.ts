import { NavLink } from '../types/navLink.types';

export const NAV_BUTTONS: NavLink[] = [
	{
		label: 'Log in',
		href: '/auth/login',
		key: 'login',
		type: 'button'
	},
	{
		label: 'Sign up',
		href: '/auth/register',
		key: 'register',
		type: 'button'
	}
];
