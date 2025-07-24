import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: { email: credentials?.email }
				});

				if (!user) {
					return null;
				}

				const passwordsMatch = await bcrypt.compare(
					credentials?.password ?? '',
					user.password ?? ''
				);

				if (!passwordsMatch) {
					return null;
				}

				return {
					id: user.id.toString(),
					email: user.email,
					name: user.name
				};
			}
		})
	],
	session: { strategy: 'jwt' },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token.id) {
				session.user.id = token.id as string;
			}
			return session;
		}
	}
};
