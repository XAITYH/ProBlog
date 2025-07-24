export type UserType = {
	id?: string;
	name?: string;
	email: string;
	password?: string;
	image?: string | null;
	likedPosts?: number[];
	collections?: number[];
};
