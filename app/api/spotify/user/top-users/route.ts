import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTopUsersByListeningMinutes } from "@/services/dynamoService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const daysAgoParam = searchParams.get("daysAgo");
	const daysAgo = daysAgoParam ? parseInt(daysAgoParam, 10) : 30;
	const numUsersParam = searchParams.get("numUsers");
	const numUsers = numUsersParam ? parseInt(numUsersParam, 10) : 5;

	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const topUsers = await getTopUsersByListeningMinutes(daysAgo, numUsers);
		return NextResponse.json({ topUsers });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
