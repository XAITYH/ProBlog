import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	compiler: {
		emotion: true
	},
	reactStrictMode: true,
	experimental: {
		serverComponentsExternalPackages: ['@vercel/blob']
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.public.blob.vercel-storage.com',
				port: '',
				pathname: '/**'
			}
		]
	}
};

export default nextConfig;
