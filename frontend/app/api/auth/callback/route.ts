export const runtime = "nodejs";
import { NextResponse } from "next/server";

interface TokenData {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code") || "";
	const state = searchParams.get("state") || "";

	const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
		},
		body: new URLSearchParams({
			code,
			redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
			grant_type: "authorization_code",
		}).toString(),
	});

	const tokenData: TokenData = await tokenResponse.json();

	if (tokenData.access_token) {
		return NextResponse.redirect(new URL("/main", request.url));
	} else {
		return NextResponse.redirect(new URL("/error", request.url));
	}
}
