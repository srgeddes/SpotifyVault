import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, MySession } from "@/lib/authOptions";

interface SpotifyArtist {
	id: string;
	name: string;
	images: { url: string }[];
	genres: string[];
	popularity: number;
	external_urls: Record<string, string>;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const time_range = searchParams.get("time_range") || "long_term";
	const limit = searchParams.get("limit") || "3";

	const session = (await getServerSession(authOptions)) as MySession | null;
	if (!session || !session.accessToken) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const spotifyApiUrl = `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${time_range}`;

	const response = await fetch(spotifyApiUrl, {
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});

	if (!response.ok) {
		return NextResponse.json({ error: "Failed to fetch top artists" }, { status: response.status });
	}

	const data = await response.json();

	const topArtists = data.items
		? data.items.map((artist: SpotifyArtist) => ({
				id: artist.id,
				name: artist.name,
				images: artist.images,
				genres: artist.genres,
				popularity: artist.popularity,
				external_urls: artist.external_urls,
		  }))
		: [];

	return NextResponse.json({ topArtists });
}
