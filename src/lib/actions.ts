import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { TopicTypes } from '@/shared/types/topics.types';
import { prisma } from './prisma';
import { NextRequest, NextResponse } from 'next/server';

// Create a new post
export async function createPost(data: {
	title: string;
	description: string;
	topic: TopicTypes;
	files: string[];
}) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}
	if (data.files.length > 5) throw new Error('Max 5 files allowed');

	const post = await prisma.post.create({
		data: {
			...data,
			files: { createMany: { data: data.files.map(url => ({ url })) } },
			authorId: session.user.id
		}
	});
	return post;
}

// Update an existing post
export async function updatePost(
	id: number,
	data: {
		title?: string;
		description?: string;
		topic?: TopicTypes;
	}
) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	const post = await prisma.post.findUnique({
		where: { id },
		select: { authorId: true }
	});

	if (post?.authorId !== session.user.id) {
		throw new Error('Forbidden: You are not the author of this post');
	}

	const updatedPost = await prisma.post.update({
		where: { id },
		data
	});
	return updatedPost;
}

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
