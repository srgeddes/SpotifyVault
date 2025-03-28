import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAllTrackPlays } from "@/services/dynamoService";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const trackPlays = await getAllTrackPlays(session?.user);
		return NextResponse.json(trackPlays);
	} catch (error: unknown) {
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
