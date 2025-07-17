import { user } from '@/shared/constants/user.constants';
import users from '@/data/users.json';
import posts from '@/data/posts.json';
import { PostType } from '@/shared/types/post.types';
import { UserType } from '@/shared/types/user.types';
import { create } from 'zustand';

type Store = {
	currentUser: UserType | null;
	users: UserType[];
	posts: PostType[];

	createUser: (user: Omit<UserType, 'id'>) => void;
	updateUser: (userId: number, updates: Partial<UserType>) => void;
	deleteUser: (userId: number) => void;

	likePost: (postId: number) => void;
	addToCollection: (postId: number) => void;

	createPost: (post: Omit<PostType, 'id'>) => void;
	updatePost: (postId: number, updates: Partial<PostType>) => void;
	deletePost: (userId: number) => void;

	resetStore: () => void;
};

const initialStoreState = {
	currentUser: user,
	users: [user],
	posts: posts
};

export const useStore = create<Store>(set => ({
	// State
	...initialStoreState,

	// Actions
	createUser: user =>
		set(state => ({
			users: [...state.users, { id: users.length + 1, ...user }]
		})),

	updateUser: (userId, updates) =>
		set(state => ({
			users: state.users.map(user =>
				user.id === userId ? { ...user, ...updates } : user
			)
		})),

	deleteUser: userId =>
		set(state => ({
			users: state.users.filter(user => user.id !== userId)
		})),

	likePost: postId =>
		set(state => {
			if (!state.currentUser) return state;

			const isLiked = state.currentUser.likedPosts?.includes(postId);

			return {
				currentUser: {
					...state.currentUser,
					likedPosts: isLiked
						? state.currentUser.likedPosts?.filter(
								id => id !== postId
						  )
						: [...(state.currentUser.likedPosts || []), postId]
				}
			};
		}),

	addToCollection: postId =>
		set(state => {
			if (!state.currentUser) return state;

			const inCollection =
				state.currentUser.postsInCollection?.includes(postId);

			return {
				currentUser: {
					...state.currentUser,
					postsInCollection: inCollection
						? state.currentUser.postsInCollection?.filter(
								id => id !== postId
						  )
						: [
								...(state.currentUser.postsInCollection || []),
								postId
						  ]
				}
			};
		}),

	createPost: post => {
		set(state => {
			const titleExists = state.posts.some(
				p => p.title.toLowerCase() === post.title.toLowerCase()
			);

			if (titleExists) {
				throw new Error('A post with this title already exists');
			}

			return {
				posts: [
					...state.posts,
					{
						id: Math.max(0, ...state.posts.map(p => p.id)) + 1,
						...post
					}
				]
			};
		});
	},

	updatePost: (postId, updates) =>
		set(state => ({
			posts: state.posts.map(post =>
				post.id === postId ? { ...post, ...updates } : post
			)
		})),

	deletePost: postId =>
		set(state => ({
			posts: state.posts.filter(post => post.id !== postId)
		})),

	resetStore: () =>
		set({
			currentUser: user,
			users: initialStoreState.users,
			posts: initialStoreState.posts
		})
}));
