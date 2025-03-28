import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getUserListeningMinutesPercentile } from "@/services/dynamoService";
import { authOptions } from "@/lib/authOptions";
import type { User } from "@/services/dynamoService";
import type { MySession } from "@/lib/authOptions";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const daysAgoParam = searchParams.get("daysAgo");
	const daysAgo = daysAgoParam ? parseInt(daysAgoParam, 10) : 30;

	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const mySession = session as MySession;
		const fullUser: User = {
			id: mySession.user.id,
			spotifyId: mySession.user.id,
			email: mySession.user.email || "",
			displayName: mySession.user.name || "",
			refreshToken: "",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const percentileData = await getUserListeningMinutesPercentile(fullUser, daysAgo);
		return NextResponse.json({ percentileData });
	} catch (error: unknown) {
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
