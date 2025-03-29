import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import { upsertUser } from "@/services/dynamoService";

interface SpotifyProfile {
	id: string;
	display_name?: string;
	email?: string;
}

interface SpotifyAccount {
	access_token: string;
	refresh_token: string;
	expires_in: number;
}

export interface MyToken extends JWT {
	accessToken?: string;
	refreshToken?: string;
	accessTokenExpires?: number;
	error?: string;
}

export interface MySession {
	user: {
		id: string;
		name?: string;
		email?: string;
		image?: string;
	};
	expires: string;
	accessToken?: string;
	error?: string;
}

async function refreshAccessToken(token: MyToken): Promise<MyToken> {
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
				refresh_token: token.refreshToken || "",
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
	} catch (error: unknown) {
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
			profile: (profile) => {
				return {
					id: profile.display_name,
					name: profile.display_name,
					email: profile.email,
					image: profile.images?.[0]?.url,
				};
			},
		}),
	],
	callbacks: {
		async signIn({ account, profile }): Promise<boolean> {
			const spotifyProfile = profile as SpotifyProfile | null;
			const userId = spotifyProfile?.display_name;
			console.log(userId);
			if (!userId) {
				console.error("No user display_name found in signIn callback");
				return false;
			}

			const newUser = {
				id: userId,
				spotifyId: spotifyProfile?.id,
				email: spotifyProfile?.email || "",
				displayName: spotifyProfile?.display_name || "",
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

		async jwt({ token, account }): Promise<JWT> {
			let myToken = token as MyToken;
			if (account) {
				const spotifyAccount = account as unknown as SpotifyAccount;
				myToken = {
					...myToken,
					accessToken: spotifyAccount.access_token,
					refreshToken: spotifyAccount.refresh_token,
					accessTokenExpires: Date.now() + spotifyAccount.expires_in * 1000,
				};
				return myToken as JWT;
			}
			if (Date.now() < (myToken.accessTokenExpires ?? 0)) {
				return myToken;
			}
			return await refreshAccessToken(myToken);
		},

		async session({ session, token }): Promise<MySession> {
			const myToken = token as MyToken;
			const mySession = session as unknown as MySession;
			mySession.user.id = myToken.sub || "";
			mySession.accessToken = myToken.accessToken;
			mySession.error = myToken.error;
			mySession.expires = session.expires;
			return mySession;
		},

		async redirect({ url, baseUrl }): Promise<string> {
			if (url === baseUrl || url === "/") {
				return `${baseUrl}/vault`;
			}
			return url.startsWith("/") ? `${baseUrl}${url}` : url;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};
