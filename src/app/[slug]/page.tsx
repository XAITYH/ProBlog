import { notFound } from 'next/navigation';
import posts from '@/data/posts.json';
import BadgeCard from '@/components/card/BadgeCard';

export async function generateStaticParams() {
	return posts.map(post => ({ slug: post.slug }));
}

export const revalidate = 3600;

export default function Post({ params }: { params: { slug: string } }) {
	const post = posts.find(p => p.slug === params.slug);
	if (!post) notFound();

	return <BadgeCard />;
}
