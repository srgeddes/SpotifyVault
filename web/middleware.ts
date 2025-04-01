import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });

	if (token && req.nextUrl.pathname === "/") {
		return NextResponse.redirect(new URL("/vault", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/"],
};
