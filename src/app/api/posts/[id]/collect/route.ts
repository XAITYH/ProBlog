import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { id } = await context.params;
		const postId = Number(id);
		if (isNaN(postId)) {
			return NextResponse.json(
				{ error: 'Invalid post ID' },
				{ status: 400 }
			);
		}

		// Check if the collection already exists
		const existing = await prisma.collection.findUnique({
			where: {
				userId_postId: {
					userId: session.user.id,
					postId: postId
				}
			}
		});

		if (existing) {
			// Remove from collection
			await prisma.collection.delete({
				where: {
					userId_postId: {
						userId: session.user.id,
						postId: postId
					}
				}
			});
			return NextResponse.json({ success: true, collected: false });
		} else {
			// Add to collection
			await prisma.collection.create({
				data: {
					userId: session.user.id,
					postId: postId
				}
			});
			return NextResponse.json({ ok: true, collected: true });
		}
	} catch (error) {
		console.error('[COLLECT_POST_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
