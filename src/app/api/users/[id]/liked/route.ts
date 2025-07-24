import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	_req: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	const posts = await prisma.post.findMany({
		where: {
			likedBy: { some: { userId: id } }
		},
		include: {
			author: { select: { id: true, name: true, image: true } },
			files: true
		}
	});
	return NextResponse.json(posts);
}
