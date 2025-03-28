import { authOptions, MySession } from "@/lib/authOptions";
import { getUndergroundScore, User } from "@/services/dynamoService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
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

		const undergroundScore = await getUndergroundScore(fullUser);
		return NextResponse.json({ undergroundScore });
	} catch (error: unknown) {
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
