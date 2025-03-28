import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getUserListeningMinutesPercentile } from "@/services/dynamoService";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const daysAgoParam = searchParams.get("daysAgo");
	const daysAgo = daysAgoParam ? parseInt(daysAgoParam, 10) : 30;

	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const percentileData = await getUserListeningMinutesPercentile(session.user, daysAgo);
		return NextResponse.json({ percentileData });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
