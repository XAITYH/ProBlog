export type UserType = {
	id: number | null;
	name: string;
	email: string;
	image: string;
	likedPosts?: number[];
	postsInCollection?: number[];
};
