import { NextRequest, NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = (await req.json()) as Parameters<
			typeof handleUpload
		>[0]['body'];

		const jsonResponse = await handleUpload({
			body,
			request: req,
			onBeforeGenerateToken: async () => {
				return { allowedContentTypes: ['image/*'], tokenPayload: '' };
			},
			onUploadCompleted: async () => {
				return;
			}
		});
		return NextResponse.json(jsonResponse);
	} catch (error) {
		console.error('[UPLOAD_ERROR]', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
