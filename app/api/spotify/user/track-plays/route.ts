import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAllTrackPlays } from "@/services/dynamoService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const trackPlays = await getAllTrackPlays(session?.user);
		return NextResponse.json(trackPlays);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
