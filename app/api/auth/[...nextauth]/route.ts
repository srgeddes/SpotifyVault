import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token: any) {
	try {
		const url =
			"https://accounts.spotify.com/api/token?" +
			new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: token.refreshToken,
				client_id: process.env.SPOTIFY_CLIENT_ID!,
				client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
			});

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			// Set the new expiry time (current time + expires_in seconds)
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			// Use the new refresh token if provided, else fall back to the old one
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
		};
	} catch (error) {
		console.error("Error refreshing access token:", error);
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
			authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,user-top-read",
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
