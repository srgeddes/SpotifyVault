import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getTotalMinutesListened } from "@/services/dynamoService";
import { authOptions, MySession } from "@/lib/authOptions";

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
		const userForMinutes = { id: mySession.user.id };
		const minutesListened = await getTotalMinutesListened(userForMinutes, daysAgo);
		return NextResponse.json({ minutesListened });
	} catch (error: unknown) {
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
