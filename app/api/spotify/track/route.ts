// app/api/spotify/track/route.ts
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotifyAuth";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const trackId = searchParams.get("track");

	if (!trackId) {
		return NextResponse.json({ error: "Track query parameter is required." }, { status: 400 });
	}

	try {
		const token = await getAccessToken();

		const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${encodeURIComponent(trackId)}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!trackResponse.ok) {
			const errorData = await trackResponse.json();
			return NextResponse.json({ error: errorData.error?.message || "Track not found." }, { status: trackResponse.status });
		}

		const trackData = await trackResponse.json();

		const imageUrl = trackData.album.images?.[0]?.url || null;
		const trackName = trackData.name || null;

		return NextResponse.json({ imageUrl, trackName });
	} catch (error) {
		console.error("Error fetching track data:", error);
		return NextResponse.json({ error: "Failed to fetch track data." }, { status: 500 });
	}
}
