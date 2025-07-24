'use client';

import classes from './imageSection.module.css';

import { PostType } from '@/shared/types/post.types';
import { Card, Image } from '@mantine/core';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { Zoom } from 'yet-another-react-lightbox/plugins';
import { Carousel } from '@mantine/carousel';

const ImageSection = ({ post }: { post: PostType }) => {
	const [opened, setOpened] = useState<number | null>(null);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const files = post.files || [];

	const handleImageClick = (idx: number) => {
		setLightboxIndex(idx);
		setOpened(post.id);
	};

	return (
		<>
			<Card.Section>
				{files.length > 1 ? (
					<Carousel
						slideSize='100%'
						withIndicators
						className={classes.carousel}
					>
						{files.map((file, idx) => (
							<Carousel.Slide key={file.url}>
								<Image
									alt={post.title}
									src={file.url}
									className={classes.image}
									loading='lazy'
									onClick={() => handleImageClick(idx)}
								/>
							</Carousel.Slide>
						))}
					</Carousel>
				) : files.length === 1 ? (
					<Image
						alt={post.title}
						key={post.id}
						src={files[0].url}
						className={classes.image}
						loading='lazy'
						onClick={() => handleImageClick(0)}
					/>
				) : null}
			</Card.Section>

			<Lightbox
				open={post.id === opened}
				index={lightboxIndex}
				close={() => setOpened(null)}
				plugins={[Zoom]}
				slides={files.map(file => ({ src: file.url }))}
				controller={{
					disableSwipeNavigation: files.length < 2
				}}
				render={
					files.length < 2
						? {
								buttonNext: () => null,
								buttonPrev: () => null
						  }
						: {}
				}
			/>
		</>
	);
};

export default ImageSection;
