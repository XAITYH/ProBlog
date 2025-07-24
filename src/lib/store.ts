import { PostType } from '@/shared/types/post.types';
import { UserType } from '@/shared/types/user.types';
import { create } from 'zustand';
import { TopicTypes } from '@/shared/types/topics.types';

type Store = {
	currentUser: UserType | null;
	posts: PostType[];
	nextCursor: string | null;
	isLoadingPosts: boolean;
	currentTopic: TopicTypes;

	// User
	updateUser: (updates: Partial<UserType>) => Promise<void>;
	deleteUser: () => Promise<void>;

	// Post fetching
	fetchPosts: (topic: TopicTypes, cursor?: string | null) => Promise<void>;
	refreshPosts: () => Promise<void>;

	// Post interactions
	likePost: (postId: number) => Promise<void>;
	addToCollection: (postId: number) => Promise<void>;
	fetchLikedPosts: () => Promise<PostType[]>;
	fetchCollectionPosts: () => Promise<PostType[]>;

	// Post management
	createPost: (formData: FormData) => Promise<PostType>;
	updatePost: (postId: number, updates: Partial<PostType>) => Promise<void>;
	deletePost: (postId: number) => Promise<void>;

	// Session sync (from NextAuth)
	setCurrentUser: (user: UserType | null) => Promise<void>;
	hydrateUserData: (userId: string) => Promise<void>;
};

const initialStoreState = {
	currentUser: null,
	posts: [],
	nextCursor: null,
	isLoadingPosts: false,
	currentTopic: 'all' as TopicTypes
};

export const useStore = create<Store>((set, get) => ({
	// State
	...initialStoreState,

	// Actions

	// User
	updateUser: async updates => {
		const { currentUser } = get();
		if (!currentUser) return;

		try {
			const res = await fetch(`/api/users/${currentUser.id}`, {
				method: 'PUT',
				body: JSON.stringify(updates)
			});

			if (!res.ok) throw new Error('Failed to update');
		} catch (error) {
			console.error('Failed to update user:', error);
		}
	},

	deleteUser: async () => {
		const { currentUser } = get();
		if (!currentUser) return;

		try {
			const res = await fetch(`/api/users/${currentUser.id}`, {
				method: 'DELETE'
			});

			if (!res.ok) throw new Error('Failed to delete');
		} catch (error) {
			console.error('Failed to delete user:', error);
		}
	},

	// User interactions with posts
	likePost: async postId => {
		const { currentUser } = get();
		if (!currentUser) return;

		// Optimistic update
		set(state => ({
			currentUser: {
				...state.currentUser!,
				likedPosts: state.currentUser?.likedPosts?.includes(postId)
					? state.currentUser?.likedPosts?.filter(id => id !== postId)
					: [...(state.currentUser?.likedPosts ?? []), postId]
			}
		}));

		try {
			const response = await fetch(`/api/posts/${postId}/like`, {
				method: 'POST'
			});
			if (!response.ok) throw new Error('Failed to like');
		} catch (error) {
			// Rollback on error
			set(state => ({
				currentUser: {
					...state.currentUser!,
					likedPosts: state.currentUser?.likedPosts?.includes(postId)
						? [...(state.currentUser?.likedPosts ?? []), postId]
						: state.currentUser?.likedPosts?.filter(
								id => id !== postId
						  ) ?? []
				}
			}));
			console.error(error);
		}
	},

	addToCollection: async postId => {
		const { currentUser } = get();
		if (!currentUser) return;

		try {
			const res = await fetch(`/api/posts/${postId}/collect`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!res.ok) throw new Error(await res.text());

			set(state => ({
				currentUser: {
					...state.currentUser!,
					collections: state.currentUser?.collections?.includes(
						postId
					)
						? state.currentUser?.collections?.filter(
								id => id !== postId
						  ) ?? []
						: [...(state.currentUser?.collections ?? []), postId]
				}
			}));
		} catch (error) {
			console.error('Failed to add to collection:', error);
			throw error;
		}
	},

	fetchLikedPosts: async () => {
		const { currentUser } = get();
		if (!currentUser?.id) return [];
		const res = await fetch(`/api/users/${currentUser.id}/liked`);
		return res.ok ? await res.json() : [];
	},
	fetchCollectionPosts: async () => {
		const { currentUser } = get();
		if (!currentUser?.id) return [];
		const res = await fetch(`/api/users/${currentUser.id}/collections`);
		return res.ok ? await res.json() : [];
	},

	// Post
	fetchPosts: async (topic, cursor) => {
		if (get().isLoadingPosts) return;

		set({ isLoadingPosts: true, currentTopic: topic });
		try {
			const res = await fetch(
				`/api/posts?topic=${topic}${cursor ? `&cursor=${cursor}` : ''}`
			);

			if (!res.ok) throw new Error(await res.text());

			const data = await res.json();

			set(state => ({
				posts: cursor ? [...state.posts, ...data.posts] : data.posts,
				nextCursor: data.nextCursor ?? null,
				isLoadingPosts: false
			}));
		} catch (error) {
			console.error('Failed to fetch posts:', error);
			set({ isLoadingPosts: false });
			throw error;
		}
	},

	refreshPosts: async () => {
		await get().fetchPosts(get().currentTopic);
	},

	createPost: async formData => {
		try {
			const res = await fetch('/api/posts', {
				method: 'POST',
				body: formData
			});

			if (!res.ok) throw new Error('Failed to create post');

			const newPost = await res.json();
			set(state => ({ posts: [newPost, ...state.posts] }));
			return newPost;
		} catch (error) {
			console.error('Post creation failed:', error);
			throw error;
		}
	},

	updatePost: async (postId, updates) => {
		try {
			const res = await fetch(`/api/posts/${postId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates)
			});
			if (!res.ok) throw new Error(await res.text());
			const updatedPost = await res.json();
			set(state => ({
				posts: state.posts.map(post =>
					post.id === postId ? { ...post, ...updatedPost } : post
				)
			}));
		} catch (error) {
			console.error('Failed to update post:', error);
			throw error;
		}
	},

	deletePost: async postId => {
		try {
			const res = await fetch(`/api/posts/${postId}`, {
				method: 'DELETE'
			});
			if (!res.ok) throw new Error(await res.text());
			set(state => ({
				posts: state.posts.filter(post => post.id !== postId)
			}));
		} catch (error) {
			console.error('Failed to delete post:', error);
			throw error;
		}
	},

	hydrateUserData: async userId => {
		try {
			const res = await fetch(`/api/users/${userId}/hydrate`);
			const { likedPosts, collections } = await res.json();

			set(state => ({
				currentUser: state.currentUser
					? {
							...state.currentUser,
							likedPosts: likedPosts.map(Number),
							collections: collections.map(Number)
					  }
					: null
			}));
		} catch (error) {
			console.error('Failed to hydrate user data:', error);
		}
	},

	setCurrentUser: async user => {
		set({ currentUser: user });
		if (user?.id) {
			await get().hydrateUserData(user.id);
		}
	}
}));
