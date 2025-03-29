import { NextResponse } from "next/server";
import { getUserById } from "@/services/dynamoService";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("id");
	if (!userId) {
		return NextResponse.json({ error: "Missing user id" }, { status: 400 });
	}
	try {
		const user = await getUserById(userId);
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		return NextResponse.json(user);
	} catch (error: unknown) {
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
