import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const time_range = searchParams.get("time_range") || "long_term";
	const limit = searchParams.get("limit") || "3";

	const session = await getServerSession(authOptions);
	if (!session || !session.accessToken) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const spotifyApiUrl = `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`;

	const response = await fetch(spotifyApiUrl, {
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});

	if (!response.ok) {
		return NextResponse.json({ error: "Failed to fetch top tracks" }, { status: response.status });
	}

	const data = await response.json();
	const topTracks = data.items
		? data.items.map((track: any) => ({
				id: track.id,
				name: track.name,
				album: {
					images: track.album.images,
				},
				external_urls: track.external_urls,
		  }))
		: [];

	return NextResponse.json({ topTracks });
}
