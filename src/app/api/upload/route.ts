import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const form = await req.formData();
		const file = form.get('file') as File;
		const path = form.get('path') as string;

		if (!file || !path) {
			return NextResponse.json({ error: 'Bad request' }, { status: 400 });
		}

		const blob = await put(path, file, { access: 'public' });
		return NextResponse.json({ url: blob.url });
	} catch (error) {
		console.error('[UPLOAD_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
