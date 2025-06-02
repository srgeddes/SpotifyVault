import { NextResponse } from "next/server";
import { scanUsers } from "@/services/dynamoService";
import { updateUserSpotifyData } from "@/services/spotifyService";

export async function GET() {
	try {
		console.log("Starting database update...");
		const allUsers = await scanUsers();
		for (const user of allUsers) {
			try {
				await updateUserSpotifyData(user);
			} catch (err) {
				console.error(`Error updating ${user.id}:`, err);
			}
		}
		return NextResponse.json({ message: "Update complete" }, { status: 200 });
	} catch (err) {
		console.error("updateDatabase error:", err);
		return NextResponse.json({ error: "Update failed." }, { status: 500 });
	}
}
