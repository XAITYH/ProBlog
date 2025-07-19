export default function validateImageFile(file: File): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];
	const MAX_SIZE_MB = 10;
	const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
	const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

	// Extension check
	const extension = file.name.split('.').pop()?.toLowerCase() || '';
	if (!validExtensions.includes(`.${extension}`)) {
		errors.push(`Unsupported file type: ${extension}`);
	}

	// MIME type check
	if (!validTypes.includes(file.type)) {
		errors.push(`Invalid file format: ${file.type}`);
	}

	// Size check
	if (file.size > MAX_SIZE_MB * 1024 ** 2) {
		errors.push(`File exceeds ${MAX_SIZE_MB}MB limit`);
	}

	return { isValid: errors.length === 0, errors };
}
