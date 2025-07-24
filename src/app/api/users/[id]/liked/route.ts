import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	_req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const posts = await prisma.post.findMany({
		where: {
			likedBy: { some: { userId: params.id } }
		},
		include: {
			author: { select: { id: true, name: true, image: true } },
			files: true
		}
	});
	return NextResponse.json(posts);
}
