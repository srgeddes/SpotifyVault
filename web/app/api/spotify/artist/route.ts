import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotifyAuth";

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
