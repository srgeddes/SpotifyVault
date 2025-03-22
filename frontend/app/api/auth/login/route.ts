import { NextResponse } from "next/server";

export async function GET(request: Request) {
	console.log("Login endpoint hit");

	const state = generateRandomString(16);
	const scope = "user-read-private user-read-email";
	const params = new URLSearchParams({
		response_type: "code",
		client_id: process.env.SPOTIFY_CLIENT_ID || "",
		scope,
		redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
		state,
	});

	return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

function generateRandomString(length: number): string {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
