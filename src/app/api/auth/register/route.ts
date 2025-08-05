import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
	try {
		const { name, email, password, image } = await req.json();

		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'All fields except image are required' },
				{ status: 400 }
			);
		}

		// Validate email format
		if (!/^\S+@\S+\.\S+$/.test(email)) {
			return NextResponse.json(
				{ error: 'Invalid email format' },
				{ status: 400 }
			);
		}

		// Validate password strength
		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'Password must be at least 6 characters' },
				{ status: 400 }
			);
		}

		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ email }, { name }] }
		});

		// Check if user already exists
		if (existingUser) {
			return NextResponse.json(
				{
					error:
						existingUser.email === email
							? 'Email is already in use'
							: 'Username already taken'
				},
				{ status: 409 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				image
			}
		});

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image || null
			}
		});
	} catch (error) {
		console.error('[REGISTER_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
