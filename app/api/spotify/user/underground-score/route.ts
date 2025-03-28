import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUndergroundScore } from "@/services/dynamoService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const undergroundScore = await getUndergroundScore(session.user);
		return NextResponse.json({ undergroundScore });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
