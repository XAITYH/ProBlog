import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import { Notifications } from '@mantine/notifications';

import {
	MantineProvider,
	ColorSchemeScript,
	mantineHtmlProps
} from '@mantine/core';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/widgets/header/Header';
import { Providers } from './providers';
import SessionSync from '@/components/SessionSync';
import { Suspense } from 'react';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'ProBlog',
	description:
		'ProBlog is about sharing your posts with others from your IT community, projects, memes, news and pets 😻'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<MantineProvider defaultColorScheme='dark'>
						<Header />
						<Notifications
							position='top-center'
							className='notification'
						/>
						<SessionSync />

						<Suspense>{children}</Suspense>
					</MantineProvider>
				</Providers>
			</body>
		</html>
	);
}
