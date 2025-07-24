import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch single post
export async function GET(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		const postId = Number(context.params);

		if (isNaN(postId)) {
			return NextResponse.json(
				{ error: 'Invalid post ID' },
				{ status: 400 }
			);
		}

		const post = await prisma.post.findUnique({
			where: { id: postId },
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true
					}
				},
				likedBy: session?.user?.id
					? {
							where: {
								id: session.user.id
							},
							select: {
								id: true
							}
					  }
					: undefined,
				_count: {
					select: {
						likedBy: true,
						collections: true
					}
				}
			}
		});

		if (!post) {
			return NextResponse.json(
				{ error: 'Post not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ post });
	} catch (error) {
		console.error('[POST_GET_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// PUT - Update a post
export async function PUT(
	request: NextRequest,
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

		const postId = Number(context.params);
		if (isNaN(postId)) {
			return NextResponse.json(
				{ error: 'Invalid post ID' },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { title, description, topic } = body;

		const existingPost = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true }
		});

		if (!existingPost) {
			return NextResponse.json(
				{ error: "Post not found or you're not its owner" },
				{ status: 404 }
			);
		}

		const updatedPost = await prisma.post.update({
			where: {
				id: postId,
				authorId: session.user.id
			},
			data: {
				title,
				description,
				topic,
				files: {
					set: [...(body.files || [])]
				}
			}
		});

		return NextResponse.json(updatedPost, { status: 200 });
	} catch (error) {
		console.error('[POST_UPDATE_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// DELETE - Remove a post
export async function DELETE(
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

		const postId = Number(context.params);
		if (isNaN(postId)) {
			return NextResponse.json(
				{ error: 'Invalid post ID' },
				{ status: 400 }
			);
		}

		const existingPost = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true }
		});

		if (!existingPost) {
			return NextResponse.json(
				{ error: "Post not found or you're not its owner" },
				{ status: 404 }
			);
		}

		await prisma.post.delete({
			where: { id: postId }
		});

		return NextResponse.json({ ok: true }, { status: 200 });
	} catch (error) {
		console.error('[POST_DELETE_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
