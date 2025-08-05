import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		// Check if BLOB_READ_WRITE_TOKEN is set
		if (!process.env.BLOB_READ_WRITE_TOKEN) {
			console.error('[UPLOAD_ERROR] BLOB_READ_WRITE_TOKEN is not set');
			return NextResponse.json(
				{ error: 'Blob token not configured' },
				{ status: 500 }
			);
		}

		const form = await req.formData();
		const file = form.get('file') as File;
		const path = form.get('path') as string;

		if (!file || !path) {
			return NextResponse.json(
				{ error: 'File and path are required' },
				{ status: 400 }
			);
		}

		if (file.size > 4 * 1024 * 1024) {
			// 4MB limit
			return NextResponse.json(
				{ error: 'File size too large (max 4MB)' },
				{ status: 400 }
			);
		}

		const blob = await put(path, file, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN,
			addRandomSuffix: true
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
