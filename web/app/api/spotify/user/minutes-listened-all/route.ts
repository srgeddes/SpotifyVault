import { NextResponse } from "next/server";
import { getSpotifyUserProfile } from "@/lib/spotifyApi";
import { getTotalMinutesListened, scanUsers } from "@/services/dynamoService";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const daysAgo = Number(searchParams.get("daysAgo") || "100000");

		const users = await scanUsers();

		const usersWithMinutes = await Promise.all(
			users.map(async (user) => {
				const minutes = await getTotalMinutesListened(user, daysAgo);

				let profileImage = null;
				if (user.accessToken) {
					const profile = await getSpotifyUserProfile(user.accessToken);
					profileImage = profile?.images?.[0]?.url || null;
				}

				return {
					id: user.id,
					displayName: user.displayName || "Unknown User",
					spotifyId: user.spotifyId,
					profileImage: profileImage,
					minutesListened: minutes,
				};
			})
		);

		usersWithMinutes.sort((a, b) => b.minutesListened - a.minutesListened);

		return NextResponse.json({ users: usersWithMinutes });
	} catch (error) {
		console.error("Error fetching user minutes:", error);
		return NextResponse.json({ error: "Failed to fetch user minutes" }, { status: 500 });
	}
}
