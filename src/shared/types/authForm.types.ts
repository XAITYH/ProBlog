import { UserType } from './user.types';

export type AuthFormType = {
	type: 'login' | 'register';
	onSubmit: (userData: UserType) => void;
};
