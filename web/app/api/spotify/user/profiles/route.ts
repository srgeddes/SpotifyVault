import { NextResponse } from "next/server";
import { getSpotifyUserProfile } from "@/lib/spotifyApi";
import { scanUsers } from "@/services/dynamoService";

export async function GET() {
	try {
		const users = await scanUsers();

		const usersWithProfiles = await Promise.all(
			users.map(async (user) => {
				if (!user.accessToken) {
					return {
						id: user.id,
						displayName: user.displayName || "Unknown User",
						spotifyId: user.spotifyId,
						profileImage: null,
					};
				}

				const profile = await getSpotifyUserProfile(user.accessToken);

				return {
					id: user.id,
					displayName: user.displayName || profile?.display_name || "Unknown User",
					spotifyId: user.spotifyId,
					profileImage: profile?.images?.[0]?.url || null,
				};
			})
		);

		return NextResponse.json({ users: usersWithProfiles });
	} catch (error) {
		console.error("Error fetching user profiles:", error);
		return NextResponse.json({ error: "Failed to fetch user profiles" }, { status: 500 });
	}
}
