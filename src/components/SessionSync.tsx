'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/lib/store';

export default function SessionSync() {
	const { data: session } = useSession();
	const setCurrentUser = useStore(state => state.setCurrentUser);

	useEffect(() => {
		if (session?.user) {
			setCurrentUser({
				id: session.user.id,
				name: session.user.name || '',
				email: session.user.email || '',
				image: session.user.image || null
			});
		} else {
			setCurrentUser(null);
		}
	}, [session, setCurrentUser]);

	return null;
}
