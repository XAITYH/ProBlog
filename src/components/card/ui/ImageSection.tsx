'use client';

import classes from './imageSection.module.css';

import { PostType } from '@/shared/types/post.types';
import { Card, Image } from '@mantine/core';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { Zoom } from 'yet-another-react-lightbox/plugins';

const ImageSection = ({ post }: { post: PostType }) => {
	const [opened, setOpened] = useState<number | null>(null);

	return (
		<>
			<Card.Section>
				<Image
					alt={post.title}
					key={post.id}
					src={post.images ? post.images[0] : ''}
					className={classes.image}
					loading='lazy'
					onClick={() => setOpened(post.id)}
				/>
			</Card.Section>

			<Lightbox
				open={post.id === opened}
				close={() => setOpened(null)}
				plugins={[Zoom]}
				slides={
					post.images
						? post.images.map(image => ({
								src: image
						  }))
						: []
				}
				controller={{
					disableSwipeNavigation: post.images
						? post.images.length < 2
						: false
				}}
				render={
					post.images
						? post.images.length < 2
							? {
									buttonNext: () => null,
									buttonPrev: () => null
							  }
							: {}
						: {}
				}
			/>
		</>
	);
};

export default ImageSection;
