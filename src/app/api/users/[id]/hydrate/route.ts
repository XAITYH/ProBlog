import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	const session = await getServerSession(authOptions);
	if (!session?.user || session.user.id !== id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			likedPosts: { select: { postId: true } },
			collections: { select: { postId: true } }
		}
	});

	return Response.json({
		likedPosts: user?.likedPosts.map(p => Number(p.postId)) || [],
		collections: user?.collections.map(p => Number(p.postId)) || []
	});
}
