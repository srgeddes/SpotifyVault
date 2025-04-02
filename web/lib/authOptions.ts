import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserById, upsertUser, User } from "@/services/dynamoService";

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

interface DemoUser extends User {
	demo: true;
	accessToken: string;
	accessTokenExpires: number;
}

export interface MyToken extends JWT {
	accessToken?: string;
	refreshToken?: string;
	accessTokenExpires?: number;
	error?: string;
	demo?: boolean;
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
	if (!token.refreshToken) {
		return { ...token, error: "RefreshAccessTokenError" };
	}
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
		if (!response.ok) throw refreshedTokens;
		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			refreshToken: token.refreshToken,
		};
	} catch (error) {
		return { ...token, error: error instanceof Error ? error.message : String(error) };
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID || "",
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
			authorization:
				"https://accounts.spotify.com/authorize?scope=user-read-email%20user-read-private%20user-top-read%20user-read-recently-played%20user-library-read%20playlist-read-private%20playlist-read-collaborative%20user-follow-read%20user-read-playback-state%20user-read-currently-playing",
			profile: (profile) => ({
				id: profile.id,
				name: profile.display_name,
				email: profile.email,
				image: profile.images?.[0]?.url,
			}),
		}),
		CredentialsProvider({
			id: "demo",
			name: "Demo Account",
			credentials: {},
			async authorize() {
				const mainAccountId = "srgeddes";
				const userFromDB = await getUserById(mainAccountId);
				if (!userFromDB || !userFromDB.refreshToken) {
					throw new Error("Demo user not found in database or refresh token is missing");
				}
				const initialToken: MyToken = {
					refreshToken: userFromDB.refreshToken,
					accessToken: "",
					accessTokenExpires: 0,
					demo: true,
				};
				const refreshedToken = await refreshAccessToken(initialToken);
				if (!refreshedToken.accessToken) {
					throw new Error("Failed to retrieve a valid access token");
				}
				const demoUser: DemoUser = {
					...userFromDB,
					displayName: "Demo User",
					demo: true,
					accessToken: refreshedToken.accessToken,
					accessTokenExpires: refreshedToken.accessTokenExpires!,
				};
				return demoUser;
			},
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			if (account?.provider === "demo") return true;
			const spotifyProfile = profile as SpotifyProfile | null;
			const userId = spotifyProfile?.id;
			if (!userId) return false;
			const newUser: User = {
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
			} catch {
				return false;
			}
			return true;
		},
		async jwt({ token, account, user }) {
			let myToken = token as MyToken;
			if (account && user) {
				if (account.provider !== "demo") {
					const spotifyAccount = account as unknown as SpotifyAccount;
					myToken = {
						...myToken,
						sub: user.id,
						accessToken: spotifyAccount.access_token,
						refreshToken: spotifyAccount.refresh_token,
						accessTokenExpires: Date.now() + spotifyAccount.expires_in * 1000,
					};
					return myToken;
				}
				myToken = {
					...myToken,
					sub: user.id,
					refreshToken: (user as DemoUser).refreshToken,
					accessToken: (user as DemoUser).accessToken,
					accessTokenExpires: (user as DemoUser).accessTokenExpires,
					demo: true,
				};
				return myToken;
			}
			if (myToken.demo) return myToken;
			if (Date.now() < (myToken.accessTokenExpires ?? 0)) return myToken;
			return await refreshAccessToken(myToken);
		},
		async session({ session, token }) {
			const myToken = token as MyToken & { demo?: boolean };
			const mySession = session as MySession;
			mySession.user.id = myToken.sub || "";
			mySession.accessToken = myToken.accessToken;
			mySession.error = myToken.error;
			if (myToken.demo) {
				mySession.user.id = "srgeddes";
				mySession.user.name = "Demo User";
				mySession.user.image = "/images/demo_user_profile.jpg";
			}
			mySession.expires = session.expires;
			return mySession;
		},
		async redirect({ url, baseUrl }) {
			if (url === baseUrl || url === "/") return `${baseUrl}/vault`;
			return url.startsWith("/") ? `${baseUrl}${url}` : url;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};
