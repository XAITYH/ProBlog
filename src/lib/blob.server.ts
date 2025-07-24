import { put, del } from '@vercel/blob';

export async function uploadFile(file: File, pathname: string) {
	const blob = await put(pathname, file, {
		access: 'public',
		addRandomSuffix: true,
		token: process.env.BLOB_READ_WRITE_TOKEN
	});
	return blob.url;
}

export async function deleteFile(url: string) {
	await del(url, {
		token: process.env.BLOB_READ_WRITE_TOKEN
	});
}
