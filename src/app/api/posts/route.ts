import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const topic = searchParams.get('topic') || 'all';
		const cursor = searchParams.get('cursor');
		const take = 10;

		const where = topic === 'all' ? {} : { topic };

		const posts = await prisma.post.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			take,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: Number(cursor) } : undefined,
			include: {
				author: {
					select: { id: true, name: true, email: true, image: true }
				},
				files: true,
				_count: { select: { likedBy: true, collections: true } }
			}
		});

		const nextCursor =
			posts.length === take ? posts[posts.length - 1].id : null;

		return NextResponse.json({ posts, nextCursor });
	} catch (error) {
		console.error('[POSTS_GET_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.formData();
		const title = body.get('title') as string;
		const description = body.get('description') as string;
		const topic = body.get('topic') as string;

		// Handle both 'files' and 'fileUrls' for backward compatibility
		const files = body.getAll('files') as string[];
		const fileUrls = body.getAll('fileUrls') as string[];
		const allFileUrls = [...files, ...fileUrls];

		if (!title || !description || !topic) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		if (allFileUrls.length > 5) {
			return NextResponse.json(
				{ error: 'Max 5 files allowed' },
				{ status: 400 }
			);
		}

		const post = await prisma.post.create({
			data: {
				title,
				description,
				topic,
				authorId: session.user.id,
				files: {
					create: allFileUrls.map(url => ({
						url
					}))
				}
			},
			include: {
				author: {
					select: { id: true, name: true, email: true, image: true }
				},
				files: true,
				_count: { select: { likedBy: true, collections: true } }
			}
		});

		return NextResponse.json(post, { status: 201 });
	} catch (error) {
		console.error('[POSTS_CREATE_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
