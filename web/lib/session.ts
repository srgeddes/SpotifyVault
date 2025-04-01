import { withIronSessionSsr } from "iron-session/next";
import type { IronSessionOptions } from "iron-session";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export const sessionOptions: IronSessionOptions = {
	password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
	cookieName: "spotify_session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

export function withSessionSsr<P extends Record<string, unknown> = Record<string, unknown>>(
	handler: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>
) {
	return withIronSessionSsr(handler, sessionOptions);
}
