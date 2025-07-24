import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				_count: {
					select: {
						posts: true,
						likedPosts: true,
						collections: true
					}
				}
			}
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error('[USER_GET_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	try {
		const { name, image } = await request.json();

		const updatedUser = await prisma.user.update({
			where: { id },
			data: { name, image }
		});

		return NextResponse.json({ success: true, updatedUser });
	} catch (error) {
		console.error('[USER_UPDATE_ERROR]', error);
	}
}

export async function DELETE(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	try {
		await prisma.user.delete({
			where: { id }
		});

		return NextResponse.json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('[USER_DELETE_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
