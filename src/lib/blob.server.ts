import { put, del } from '@vercel/blob';

export async function uploadFile(file: File, pathname: string) {
	const blob = await put(pathname, file, {
		access: 'public',
		addRandomSuffix: true
	});
	return blob.url;
}

export async function deleteFile(url: string) {
	await del(url);
}
