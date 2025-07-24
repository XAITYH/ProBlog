import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(_req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return NextResponse.json(
			{ error: 'Not authenticated' },
			{ status: 401 }
		);
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email }
	});

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}

	return NextResponse.json({
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image
		}
	});
}
