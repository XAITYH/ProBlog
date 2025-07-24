import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id)
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);

		// 2. Parse ID
		const { id } = await params;
		const postId = Number(id);
		if (isNaN(postId))
			return NextResponse.json(
				{ error: 'Invalid post ID' },
				{ status: 400 }
			);

		// 3. Toggle like atomically
		const liked = await prisma.likedPost.findUnique({
			where: { userId_postId: { userId: session.user.id, postId } }
		});

		if (liked) {
			// Unlike
			await prisma.likedPost.delete({
				where: { userId_postId: { userId: session.user.id, postId } }
			});
		} else {
			// Like
			await prisma.likedPost.create({
				data: { userId: session.user.id, postId }
			});
		}

		return NextResponse.json({ ok: true, liked: !liked });
	} catch (error) {
		console.error('[LIKE_POST_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
