import { authOptions } from "@/lib/authOptions";
import { getUndergroundScore } from "@/services/dynamoService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const undergroundScore = await getUndergroundScore(session.user);
		return NextResponse.json({ undergroundScore });
	} catch (error: unknown) {
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
