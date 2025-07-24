import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const { pathname } = request.nextUrl;

	const protectedRoutes = ['/profile', '/post-create', '/post-update'];

	if (protectedRoutes.some(route => pathname.startsWith(route))) {
		if (!token) {
			const url = new URL('/auth/login', request.url);
			url.searchParams.set('callbackUrl', pathname);
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/profile/:path*', '/post-create', '/post-update/:path*']
};
