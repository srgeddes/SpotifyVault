import { NextResponse } from "next/server";

async function getAccessToken(): Promise<string> {
	const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
	const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
		},
		body: "grant_type=client_credentials",
	});

	const data = await response.json();
	return data.access_token;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const artist = searchParams.get("artist");

	if (!artist) {
		return NextResponse.json({ error: "Artist query parameter is required." }, { status: 400 });
	}

	try {
		const token = await getAccessToken();
		const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist&limit=1`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const searchData = await searchResponse.json();

		if (!searchData.artists || !searchData.artists.items || searchData.artists.items.length === 0) {
			return NextResponse.json({ error: "Artist not found." }, { status: 404 });
		}

		const artistData = searchData.artists.items[0];
		const imageUrl = artistData.images?.[0]?.url || null;

		return NextResponse.json({ imageUrl });
	} catch (error) {
		console.error("Error fetching artist data:", error);
		return NextResponse.json({ error: "Failed to fetch artist data." }, { status: 500 });
	}
}
