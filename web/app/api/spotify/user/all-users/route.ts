import { scanUsers } from "@/services/dynamoService";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const users = await scanUsers();

		const formattedUsers = users.map((user) => ({
			id: user.id,
			displayName: user.displayName || "Unknown User",
			spotifyId: user.spotifyId,
			accessToken: user.accessToken,
			refreshToken: user.refreshToken,
		}));

		return NextResponse.json({ users: formattedUsers });
	} catch (error) {
		console.error("Error fetching all users:", error);
		return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
	}
}
