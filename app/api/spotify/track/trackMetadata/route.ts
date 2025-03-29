import { NextResponse } from "next/server";
import { batchGetTrackMetadata } from "@/services/dynamoService";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const idsParam = searchParams.get("ids");
	if (!idsParam) {
		return NextResponse.json({ error: "No track ids provided" }, { status: 400 });
	}

	const trackIds = idsParam.split(",");

	try {
		const metadata = await batchGetTrackMetadata(trackIds);

		return NextResponse.json(metadata);
	} catch (error: unknown) {
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
