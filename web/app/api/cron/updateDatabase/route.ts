import { NextResponse } from "next/server";
import { scanUsers } from "@/services/dynamoService";
import { updateUserSpotifyData } from "@/services/spotifyService";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get("page") || "1", 10);
	const limit = parseInt(url.searchParams.get("limit") || "100", 10);

	try {
		const allUsers = await scanUsers();
		const start = (page - 1) * limit;
		const batch = allUsers.slice(start, start + limit);

		for (const user of batch) {
			try {
				await updateUserSpotifyData(user);
			} catch (err) {
				console.error(`Error updating ${user.id}:`, err);
			}
		}

		const hasMore = start + batch.length < allUsers.length;
		return NextResponse.json({ message: "batch complete", nextPage: hasMore ? page + 1 : null }, { status: 200 });
	} catch (err) {
		console.error("updateDatabase error:", err);
		return NextResponse.json({ error: "Update failed." }, { status: 500 });
	}
}
