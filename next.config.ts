import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	compiler: {
		emotion: true
	},
	reactStrictMode: true,
	experimental: {
		serverComponentsExternalPackages: ['@vercel/blob']
	}
};

export default nextConfig;
