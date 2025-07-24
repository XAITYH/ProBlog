import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const form = await req.formData();
		const file = form.get('file') as File;
		const path = form.get('path') as string;

		if (!file || !path) {
			return NextResponse.json({ error: 'Bad request' }, { status: 400 });
		}

		const blob = await put(path, file, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN
		});

		return NextResponse.json({ url: blob.url });
	} catch (error) {
		console.error('[UPLOAD_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
