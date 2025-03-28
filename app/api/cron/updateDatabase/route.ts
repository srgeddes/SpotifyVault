// app/api/cron/updateDatabase/route.ts
import { NextResponse } from "next/server";
import { scanUsers } from "@/services/dynamoService";
import { updateUserSpotifyData } from "@/services/spotifyService";

export async function GET(request: Request) {
	try {
		const users = await scanUsers();

		for (const user of users) {
			try {
				await updateUserSpotifyData(user);
			} catch (err) {
				console.error(`Error updating data for user ${user.id}:`, err);
			}
		}

		return NextResponse.json({ message: "Database updated successfully." });
	} catch (error) {
		console.error("Error updating database:", error);
		return NextResponse.json({ error: "Update failed." }, { status: 500 });
	}
}
