import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { upsertUser } from "@/services/dynamoService";

async function refreshAccessToken(token: any) {
	try {
		const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
		const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
		const url = "https://accounts.spotify.com/api/token";

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: token.refreshToken,
			}),
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
		};
	} catch (error) {
		console.error("Error refreshing access token", error);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID || "",
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
			authorization:
				"https://accounts.spotify.com/authorize?scope=user-read-email%20user-read-private%20user-top-read%20user-read-recently-played%20user-library-read%20playlist-read-private%20playlist-read-collaborative%20user-follow-read%20user-read-playback-state%20user-read-currently-playing",
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			const userId = profile?.id || user?.id;
			if (!userId) {
				console.error("No user id found in signIn callback");
				return false;
			}

			const newUser = {
				id: userId,
				spotifyId: profile?.id || userId,
				email: profile?.email || "",
				displayName: profile?.display_name || "",
				refreshToken: account?.refresh_token || "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			try {
				await upsertUser(newUser);
			} catch (err) {
				console.error("Error saving/updating user in DynamoDB: ", err);
				return false;
			}
			return true;
		},

		async jwt({ token, account }) {
			if (account) {
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					accessTokenExpires: Date.now() + account.expires_in * 1000,
				};
			}
			if (Date.now() < token.accessTokenExpires) {
				return token;
			}
			return await refreshAccessToken(token);
		},

		async session({ session, token }) {
			session.user.id = token.sub;
			session.accessToken = token.accessToken;
			session.error = token.error;
			return session;
		},

		async redirect({ url, baseUrl }) {
			if (url === baseUrl || url === "/") {
				return `${baseUrl}/vault`;
			}
			return url.startsWith("/") ? `${baseUrl}${url}` : url;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
